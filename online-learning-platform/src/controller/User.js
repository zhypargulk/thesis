import { updatePassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";

export const fetchUserData = async (id) => {
  try {
    if (auth.currentUser) {
      const userDoc = doc(db, "user", id);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        return userSnapshot.data();
      }
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
  }
};

export const updateProfileData = async (userDocRef, data) => {
  try {
    await updateDoc(userDocRef, data);
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};

export const userPasswordReset = async (user, newPassword) => {
  try {
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};
