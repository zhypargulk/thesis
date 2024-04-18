import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

export const getMessages = async (groupId) => {
  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("groupId", "==", groupId),
    orderBy("createdAt", "asc")
  );

  try {
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};
