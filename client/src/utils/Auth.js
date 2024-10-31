import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import ip from "../ip";

const AuthContext = createContext();

export const Auth = ({ children }) => {
  const [user, putUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        console.log(token);
        const decodedUser = jwtDecode(token);
        console.log(decodedUser);
        putUser(decodedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Invalid token", error);
        // Se houver um problema com o token, logout
        logout();
      }
    }

    const checkAuth = async () => {
      try {
        const response = await fetch(`${ip}/auth/check-auth`, {
          credentials: "include",
        });

        if (!response.ok) {
          setIsAuthenticated(false);
          putUser(null);
          localStorage.removeItem("token");
        }
        const responseData = await response.json();
        setIsAuthenticated(responseData.authenticated);
        putUser(responseData.user);

        localStorage.setItem("token", responseData.token);
      } catch (error) {
        setIsAuthenticated(false);
        putUser(null);
        localStorage.removeItem("user");
      }
    };

    if (!token) {
      checkAuth();
    }
  }, []);

  const login = (token) => {
    const user = jwtDecode(token);
    putUser(user);

    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
