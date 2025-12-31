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
  const [allActiveUsers, setAllActiveUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const [response1, response2] = await Promise.all([
        userServices.getAllUsers(),
        userServices?.getActiveUsers(),
      ]);
      const { data:data2, success:success2 } = response2;
      const { data:data1, success:success1 } =  response1;
      console.log("data1 from context",data1)
      if (success1) {
        setAllUsers(data1);
      } else {
        setErrorMessage("Failed to fetch users");
        return;
      }
      if (success2) {
        setAllActiveUsers(data2);
      } else {
        setErrorMessage("Failed to fetch users");
        return;
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
      allActiveUsers,
      errorMessage,
      loading,
      fetchAllUsers,
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
