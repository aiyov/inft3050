"use client";
import useLogin from "./useLogin";
import useLogout from "./useLogout";
import { useState, useEffect } from "react";
import { LoginCredentials, UserRole } from "../types/auth";
const useAuth = () => {
  const localRole = localStorage.getItem("role");
  const localIsAuthenticated = localStorage.getItem("isAuthenticated");
  const localUser = localStorage.getItem("user");
  const [user, setUser] = useState<any>(localUser ? JSON.parse(localUser) : null);
  const [role, setRole] = useState<UserRole | null>(localRole as UserRole | null);
  const [isAuthenticated, setIsAuthenticated] = useState(localIsAuthenticated === "true");
  const { mutateAsync: login, isPending: isLoading } = useLogin();
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();
  const handleAdminLogin = async (credentials: LoginCredentials) => {
    const data = await login(credentials);
    setIsAuthenticated(true);
    setUser(data);
    const role = data.role === "ADMIN" ? "admin" : "employee";
    setRole(role);
    saveToLocalStorage(data, role, true);
  };

  const handleCustomerLogin = async (credentials: LoginCredentials) => {
    const data = await login(credentials);
    setIsAuthenticated(true);
    setUser(data);
    setRole("customer");
    saveToLocalStorage(data, "customer", true);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    removeFromLocalStorage();
  };

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const localRole = localStorage.getItem("role");
    const localIsAuthenticated = localStorage.getItem("isAuthenticated");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
    if (localRole) {
      setRole(localRole as UserRole);
    }
    if (localIsAuthenticated) {
      setIsAuthenticated(localIsAuthenticated === "true");
    }
  }, []);

  const saveToLocalStorage = (user: any, role: UserRole, isAuthenticated: boolean) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role || "");
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }

  const removeFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("isAuthenticated");
  }

  return {
    isAuthenticated,
    isLoading,
    isLoggingOut,
    role,
    handleAdminLogin,
    handleCustomerLogin,
    handleLogout,
    user,
  };
};

export default useAuth;
