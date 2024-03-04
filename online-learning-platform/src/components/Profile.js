import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const firestore = getFirestore();
          const userDoc = await getDoc(
            doc(firestore, "users", auth.currentUser.uid)
          );
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
            localStorage.setItem("userData", JSON.stringify(userData)); // Store user data in localStorage
          } else {
            console.error("User data not found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      {userData ? (
        <div>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role}</p>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default Profile;
