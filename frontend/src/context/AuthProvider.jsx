import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("jobhunt_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("jobhunt_user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  // Jika tidak ada token tersimpan di storage, tidak perlu menunggu proses loading
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem("jobhunt_token")));

  // Sinkronisasi data user saat mount jika token tersedia
  useEffect(() => {
    const savedToken = localStorage.getItem("jobhunt_token");
    if (!savedToken) return;

    let isMounted = true;

    api
      .get("/auth/me")
      .then((response) => {
        if (isMounted && response?.data) {
          setUser(response.data);
          localStorage.setItem("jobhunt_user", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        console.warn("Gagal memulihkan sesi pengguna:", error.message);
        if (isMounted) {
          localStorage.removeItem("jobhunt_token");
          localStorage.removeItem("jobhunt_user");
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Fungsi Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem("jobhunt_token", receivedToken);
    localStorage.setItem("jobhunt_user", JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return receivedUser;
  };

  // Fungsi Register
  const register = async (name, email, password, role) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return response.data;
  };

  // Fungsi Logout
  const logout = () => {
    localStorage.removeItem("jobhunt_token");
    localStorage.removeItem("jobhunt_user");
    setToken(null);
    setUser(null);
  };

  // Refetch data pengguna secara manual
  const refetchUser = useCallback(async () => {
    const savedToken = localStorage.getItem("jobhunt_token");
    if (!savedToken) return null;

    const response = await api.get("/auth/me");
    if (response?.data) {
      setUser(response.data);
      localStorage.setItem("jobhunt_user", JSON.stringify(response.data));
    }
    return response?.data;
  }, []);

  const isJobSeeker = user?.role === "job_seeker";
  const isRecruiter = user?.role === "recruiter";
  const isAuthenticated = Boolean(token && user);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isJobSeeker,
    isRecruiter,
    login,
    register,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
