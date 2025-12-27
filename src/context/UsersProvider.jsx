import authServices from "@/services/authServices";
import { userServices } from "@/services/userServices";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthContext } from "./AuthProvider";

export const UserContext = createContext();
function UsersProvider({ children }) {
  const [allUsers, setAllUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const { data, success } = await userServices.getAllUsers();
      if (success) {
        setAllUsers(data);
      } else {
        setErrorMessage("Failed to fetch users");
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllUsers();
    }
  }, [fetchAllUsers, isAuthenticated]);

  const contextValue = useMemo(
    () => ({
      allUsers,
      errorMessage,
      loading,
      fetchAllUsers,
      getUserById: (id) => allUsers.find((user) => user.id === id),
      getUsersCount: () => allUsers.length,
      clearError: () => setErrorMessage(""),
    }),
    [allUsers, errorMessage, loading, fetchAllUsers]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within a UsersProvider");
  }

  return context;
};

export default UsersProvider;
