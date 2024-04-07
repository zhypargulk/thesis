import { updatePassword } from "firebase/auth";
import { auth, db, storage } from "../config/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export const getNoAvatarImage = async () => {
  const fileRef = ref(storage, `profileImages/no-avatar`);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
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
