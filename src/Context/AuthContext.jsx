import { createContext, useEffect, useState } from "react";

// 1️⃣ Create Context
export const AuthContext = createContext();

// 2️⃣ Create Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 3️⃣ Load user from localStorage on app start
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;