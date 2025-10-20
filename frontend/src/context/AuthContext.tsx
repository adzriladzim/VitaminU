// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import apiClient from "../lib/apiClient";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  role: "admin" | "student";
  full_name: string;
}

// 2. Definisikan tipe untuk Context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContextType>(
  null! as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      apiClient
        .get<User>("/users/me")
        .then((response) => {
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  // Fungsi Login
  const login = async (email: string, password: string) => {
    setError(""); // Reset error
    try {
      // 1. Panggil API Login (Backend Anda mengharapkan form-urlencoded)
      const body = new URLSearchParams();
      body.append("username", email); // Backend mengharapkan 'username'
      body.append("password", password);

      const response = await apiClient.post<{ access_token: string }>(
        "/login",
        body
      );

      const new_token = response.data.access_token;

      // 2. Simpan token
      localStorage.setItem("authToken", new_token);
      setToken(new_token); // Ini akan memicu useEffect di atas untuk ambil data user

      // 3. Ambil data user (karena useEffect mungkin butuh waktu)
      const userRes = await apiClient.get<User>("/users/me");
      setUser(userRes.data);
      localStorage.setItem("user", JSON.stringify(userRes.data));

      // 4. Arahkan ke halaman
      if (userRes.data.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("Login gagal. Email atau password salah.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
      throw err; // Lempar error agar komponen bisa stop loading
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setError("");
    try {
      // Panggil POST /users/ (Backend Anda mengharapkan JSON)
      await apiClient.post("/users/", {
        full_name: name,
        email: email,
        password: password,
      });
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setError("Email sudah terdaftar. Gunakan email lain.");
      } else {
        setError("Registrasi gagal. Silakan coba lagi.");
      }
      throw err;
    }
  };

  // Fungsi Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token,
        login,
        register,
        logout,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
