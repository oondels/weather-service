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
    (accessToke, refreshToken, profile, done) => {
      const user = {
        githubId: profile.id,
        username: profile.username,
        name: profile.displayName,
      };

      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
      done(null, { user, token });
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
    res.cookie("token", req.user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict",
    });

    res.redirect("http://localhost:3000/");
  }
);

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
    // Query sqlite

    const verificationToken = jwt.sign(
      {
        email: email,
        username: username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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

    const hashedPassword = await bcrypt.hash(password, 8);

    // Post User sqlite

    // if (postUser.rows.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "Failed to Register", error: true });
    // }
  } catch (error) {
    console.error("Error to register: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: true });
  }
});

module.exports = router;
