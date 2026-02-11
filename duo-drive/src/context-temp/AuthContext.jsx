import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // Load from localStorage on mount
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAuthToken(storedToken);
    }
  }, []);

const login = (userData) => {
  setUser(userData);
  setAuthToken(userData.token);

  // Normalize role to lowercase
  const normalizedRole = userData.is_superuser ? "admin" : userData.role?.toLowerCase();

  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("authToken", userData.token);
  localStorage.setItem("role", normalizedRole); // ✅ add this
};


  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
