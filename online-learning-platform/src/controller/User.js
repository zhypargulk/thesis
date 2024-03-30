import { auth } from "../config/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const fetchUserData = async () => {
  if (auth.currentUser) {
    const firestore = getFirestore();
    const userDoc = doc(firestore, "user", auth.currentUser.uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      return userSnapshot.data();
    }
  }
};
