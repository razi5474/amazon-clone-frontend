import { createContext, useContext, useState } from "react";
import api from "../api/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const saveAuth = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  // Register User
    const registerUser = async (form) => {
      try {
        const res = await api.post("/user/register", form);

        // Return success response instead of redirect
        return { success: true, message: "Registered successfully! Please login." };
      } catch (err) {
        return { 
          success: false, 
          message: err.response?.data?.message || "Registration failed" 
        };
      }
    };

  const loginUser = async (form) => {
    try {
      const res = await api.post("/user/login", form);
      saveAuth(res.data.user, res.data.token);
      return { success: true, message: "Login successful!" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "User not found or invalid credentials" };
    }
  };

  const googleLoginUser = async (googleUser) => {
    try {
      const res = await api.post("/user/google-auth", googleUser);
      saveAuth(res.data.user, res.data.token);
      return { success: true, message: "Google login successful!" };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Google login failed" };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loginUser, registerUser, googleLoginUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
