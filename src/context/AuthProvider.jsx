import React, { createContext, useContext, useMemo, useState } from "react";

const authContext = createContext();
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("token")
  );
  const logout = () => {
    sessionStorage.clear();
  };
  return (
    <authContext.Provider
      value={{ setIsAuthenticated, isAuthenticated, logout }}
    >
      {children}
    </authContext.Provider>
  );
}

export const useAuthContext = () => {
  const authData = useContext(authContext);
  return authData;
};
export default AuthProvider;
