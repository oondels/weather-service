import React, { useState } from "react";
import ip from "../ip";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const data = {
    userEmail: username,
    password: password,
  };

  const loginUser = () => {
    fetch(`${ip}/auth/login`, {
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

  const handleLogin = () => {
    window.location.href = `${ip}/auth/github`;
  };

  return (
    <div className="form-container">
      <div className="login-title">
        <h1>Welcome Back!</h1>
        <span>Login</span>
      </div>

      <div className="login-form form">
        <input
          onChange={(e) => setUserName(e.target.value)}
          value={username}
          type="text"
          placeholder="Username or Email"
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
        />

        <button onClick={loginUser} className="login-button">
          Login
        </button>

        <button onClick={handleLogin} className="google-login-button">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            className="google-logo"
          />
          Sign in with Github
        </button>
      </div>
    </div>
  );
};

export default Login;
