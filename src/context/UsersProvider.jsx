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
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();
function UsersProvider({ children }) {
  const [allUsers, setAllUsers] = useState([]);
  const [profile, setProfile] = useState({});
  const [allActiveUsers, setAllActiveUsers] = useState([]);
  const [allActiveGroups, setAllActiveGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const [status, setStatus] = useState("200");
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const [response1, response2, response3, response4] = await Promise.all([
        userServices.getAllUsers(),
        userServices?.getActiveUsers(),
        userServices.getProfile(),
        userServices.getActiveGroups(),
      ]);
      const { data: data4, success: success4 } = response4;
      const { data: data3, success: success3 } = response3;
      const { data: data2, success: success2 } = response2;
      const { data: data1, success: success1 } = response1;
      console.log("data1 from context", data1);
      if (success1) {
        setAllUsers(data1);
      } else {
        setErrorMessage("Failed to fetch users");
        return;
      }
      if (success2) {
        setAllActiveUsers(data2);
      } else {
        setErrorMessage("Failed to fetch active users");
        return;
      }
      if (success3) {
        setProfile(data3);
      } else {
        setErrorMessage("Failed to fetch profile");
        return;
      }
      if (success4) {
        setAllActiveGroups(data4);
      } else {
        setErrorMessage("Failed to fetch profile");
        return;
      }
    } catch (error) {
      setStatus(error.status);
      setErrorMessage(error.message || "Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [fetchUserData, isAuthenticated]);

  const contextValue = useMemo(
    () => ({
      allUsers,
      allActiveUsers,
      errorMessage,
      loading,
      fetchUserData,
      profile,
      setProfile,
      allActiveGroups,
      setAllActiveGroups,
      status,
    }),
    [
      allUsers,
      profile,
      errorMessage,
      loading,
      status,
      fetchUserData,
      setProfile,
      allActiveGroups,
      allActiveUsers,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => {
  const context = useContext(UserContext);

  // if (context === undefined) {
  //   throw new Error("useUserContext must be used within a UsersProvider");
  // }

  return context;
};

export default UsersProvider;
