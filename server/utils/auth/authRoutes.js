const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db/db.js");
const validator = require("validator");
const nodeMailer = require("nodemailer");
const router = express.Router();
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const ip = require("../ip.js");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
  host: process.env.HOST_MAIL,
  port: process.env.HOST_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        githubId: profile.id,
        username: profile.username,
        email: null,
        account_validation: false,
      };

      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

      const checkUser = `SELECT * FROM users WHERE username = ?`;
      db.get(checkUser, [profile.username], (error, row) => {
        if (error) {
          console.error("Error registering with Github.");
          return done(error, null);
        }

        if (row) {
          return done(null, { user, token });
        }

        const registerUser = `
      INSERT INTO users (username, name, user_github)
      VALUES (?, ?, ?)
      `;

        db.run(
          registerUser,
          [profile.username, profile.displayName, profile.id],
          (error) => {
            if (error) {
              console.error("Error registering user data");
              return done(error, null);
            }

            return done(null, { user, token });
          }
        );
      });
    }
  )
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  async (req, res) => {
    const token = req.user.token;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict",
    });

    res.redirect(`http://localhost:3000/`);
  }
);

router.get("/check-auth", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ authenticated: false, message: "No token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ authenticated: true, user: decoded, token: token });
  } catch (err) {
    return res
      .status(401)
      .json({ authenticated: false, message: "Error decodificating Token" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Check password validity
    if (
      !(
        (
          validator.isLength(password, { min: 6 }) &&
          /[A-Z]/.test(password) && // Pelo menos uma letra maiúscula
          /[a-z]/.test(password) && // Pelo menos uma letra minúscula
          /\d/.test(password) && // Pelo menos um número
          /\W/.test(password)
        ) // Pelo menos um caractere especial
      )
    ) {
      return res.status(403).json({
        message:
          "Password does not meet the requirements. Minimum of 7 characters, at least one uppercase letter, one number, and one special character.",
        error: true,
      });
    }

    // Check email validity
    if (!validator.isEmail(email)) {
      return res.status(403).json({ message: "Invalid Email", error: true });
    }

    // Check username disponibility
    const queryUser = `
    SELECT * FROM users
    WHERE username = ?
    `;
    db.get(queryUser, [username], (error, row) => {
      if (error) {
        console.log("Error fetching data.");
        return res
          .status(400)
          .json({ message: "Error fetching data.", error: true });
      }
      if (row)
        return res
          .status(403)
          .json({ message: "Username already in use.", error: true });
    });

    // Check username disponibility
    const queryEmail = `
    SELECT * FROM users
    WHERE email = ?
    `;
    db.get(queryEmail, [email], (error, row) => {
      if (error) {
        console.log("Error fetching data.");
        return res
          .status(400)
          .json({ message: "Error fetching data.", error: true });
      }
      if (row)
        return res
          .status(403)
          .json({ message: "Email already in use.", error: true });
    });

    const verificationToken = jwt.sign(
      {
        email: email,
        username: username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const hashedPassword = await bcrypt.hash(password, 8);

    // Post User sqlite
    const postUser = `
      INSERT INTO users (name, email, username, password)
      VALUES (?,?,?,?)
    `;
    db.run(postUser, [name, email, username, hashedPassword], (error) => {
      if (error) {
        console.error("Error during registration:", error.message);
        return res
          .status(400)
          .json({ message: "Error during registration", error: true });
      }
    });

    const verificationLink = `${ip}/auth/verify-email?token=${verificationToken}`;
    // Envio de Email
    await transporter
      .sendMail({
        to: email,
        subject: `Email Verification - ClimaSense`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #0d9757; font-size: 24px; margin: 0;">Welcome to ClimaSense!</h1>
              </div>
  
              <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
                <h2 style="color: #0056b3; font-size: 20px; margin: 0 0 10px;">Hello <strong>${name}</strong>,</h2>
                <p style="font-size: 16px; color: #555; margin: 10px 0;">Thank you for creating an account with ClimaSense. We're excited to have you onboard!</p>
  
                <h1 style="color: #0d9757; font-size: 22px; margin-bottom: 10px;">Account Details:</h1>
                <p style="font-size: 16px; color: #555;">Username: <strong>${username}</strong></p>
                <p style="font-size: 16px; color: #555;">Email: <strong>${email}</strong></p>
  
                <p style="font-size: 16px; color: #555; margin-top: 20px;">You can now start managing your tasks efficiently using ClimaSense.</p>
  
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${verificationLink}" style="background-color: #3f51b5; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 8px; font-size: 16px;">Click Here To Activate Your Account!</a>
                </div>
              </div>
  
              <div style="text-align: center; margin-top: 30px; color: #777; font-size: 14px;">
                <p>This email was generated automatically. Please do not reply.</p>
              </div>
            </div>
          `,
      })
      .then(() => {
        console.log("Email sent");
        return res.status(201).json({
          message:
            "Registered Successfully. You received an Email to cofirm your account.",
          error: false,
        });
      })
      .catch((error) => {
        console.error("Error sending email: ", error);

        return res.status(400).json({
          message:
            "Error sending email verification, please check if your email is correct.",
          error: true,
        });
      });
  } catch (error) {
    console.error("Error to register: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: true });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailUser, password } = req.body;
    const queryLogin = `
      SELECT * FROM users
      WHERE email = ? OR username = ?
    `;
    db.get(queryLogin, [emailUser, emailUser], async (error, row) => {
      if (error) {
        console.log("Error fetching user or email: ", error);
        return res
          .status(500)
          .json({ message: "Error fetching user or email.", error: true });
      }

      if (!row) {
        return res.status(404).json({ message: "Invalid Credentials." });
      }

      const checkPassword = await bcrypt.compare(password, row.password);
      if (!checkPassword) {
        return res
          .status(404)
          .json({ message: "Invalid Credentials.", error: true });
      }

      const token = jwt.sign(
        {
          username: row.username,
          id: row.id,
          account_validation: row.account_validation,
          email: row.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
        sameSite: "strict", // Prevent CSRF
      });

      return res.status(200).json({
        message: `Login successful ${row.username}`,
        error: false,
        token: token,
      });
    });
  } catch (error) {
    console.error("Login failed: ", error);
    return res.status(500).json({ message: "Login failed.", error: true });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  res.status(200).json({ message: "Successfully Logout" });
});

router.get("/verify-email", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res
      .status(400)
      .json({ message: "Invalid token provided.", error: true });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const queryUser = `
    UPDATE users 
    SET 
      account_validation = true
    WHERE 
      username = ?
    RETURNING *
    `;

    db.get(queryUser, [decoded.username], (error, row) => {
      if (error) {
        return res.status(400).json({
          message: "An error occurred while processing your request.",
          error: true,
        });
      }

      if (!row) {
        return res.status(400).json({
          message: "User not found or already verified.",
          error: true,
        });
      }

      return res
        .status(200)
        .json({ message: "Account verified successfully", error: false });
    });
  } catch (error) {
    console.error("Token verification failed: ", error);
    return res
      .status(500)
      .json({ message: "Invalid or expired token.", error: true });
  }
});

module.exports = router;
