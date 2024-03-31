import { auth, db } from "../config/firebase";
import { getDoc, doc } from "firebase/firestore";

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
