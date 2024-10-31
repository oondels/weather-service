import React, { useState } from "react";
import ip from "../ip";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const data = {
    emailUser: username,
    password: password,
  };

  const loginUser = async () => {
    fetch(`${ip}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          const responseData = await response.json();
          console.error("Error at login solicitation: ", responseData.message);
          return alert(responseData.message);
        }

        return response.json();
      })
      .then((data) => {
        alert(data.message);
        login(data.token);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error at login");
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              loginUser();
            }
          }}
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
