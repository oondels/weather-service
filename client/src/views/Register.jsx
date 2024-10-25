import React, { useState } from "react";
import ip from "../ip";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const data = {
    name: name,
    email: email,
    username: username,
    password: password,
  };

  const registerUser = () => {
    fetch(`${ip}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => {
        // if (!response.ok) {
        //   return console.error("Error at login solicitation: ", error);
        // }

        return response.json();
      })
      .then((data) => {
        // toggleAlert("Success", data.message);
        // login();
        // setTimeout(() => {
        //   navigate("/tasks");
        // }, 1500);
      })
      .catch((error) => {
        console.error("Error at login: ", error);
      });
  };

  const handleRegister = () => {
    window.location.href = `${ip}/auth/google`;
  };

  return (
    <div className="form-container">
      <div className="login-title">
        <h1>Sign Up</h1>
        <span>Now</span>
      </div>

      <div className="login-form form">
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Name"
        />

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          placeholder="Email"
        />

        <input
          onChange={(e) => setUserName(e.target.value)}
          value={username}
          type="text"
          placeholder="Username"
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
        />
        <p>
          Already have an account? <a href="/login">Sign In</a>
        </p>
        <button onClick={registerUser} className="login-button">
          Sign Up
        </button>

        <button onClick={handleRegister} className="google-login-button">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            className="google-logo"
          />
          Sign up with Github
        </button>
      </div>
    </div>
  );
};

export default Register;
