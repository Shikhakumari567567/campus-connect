import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("campus_user")) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("campus_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("campus_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("campus_token");
        localStorage.removeItem("campus_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("campus_token", data.token);
    localStorage.setItem("campus_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function register(form) {
    const { data } = await api.post("/auth/register", form);
    localStorage.setItem("campus_token", data.token);
    localStorage.setItem("campus_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("campus_token");
    localStorage.removeItem("campus_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
