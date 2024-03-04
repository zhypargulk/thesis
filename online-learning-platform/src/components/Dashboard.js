import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Profile from "./Profile.js"; // Import CSS file
import { useUserRole } from "./UserRoleContext";
import { Button } from "primereact/button";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  useEffect(() => {
    console.log("useEffect hook triggered");
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        try {
          const firestore = getFirestore();
          const userDoc = await getDoc(
            doc(firestore, "users", auth.currentUser.uid)
          );
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);

            // Store user role in local storage
            localStorage.setItem("userRole", userData.role);
          } else {
            console.error("User data not found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        } finally {
          setLoading(false); // Set loading to false after fetching user data
        }
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    // Retrieve user role from local storage on component mount
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserRole) {
      setUserRole(storedUserRole);
      setLoading(false);
    }
  }, []);

  const userRoles = useUserRole();

  const logout = async () => {
    await signOut(auth);

    // Clear user role from local storage and reset state
    localStorage.removeItem("userRole");
    setUserRole("");
  };

  return (
    <div>
      <h2>User Role: {userRoles}</h2>

      <h1>Welcome to Dashboard</h1>
      {<p>Hello, {auth.currentUser?.displayName}</p>}
      <p>Your role: {userRole}</p>
      {/* <Profile /> */}
      <Button label="Logout" onClick={logout} />
    </div>
  );
};

export default Dashboard;
