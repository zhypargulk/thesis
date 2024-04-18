import React, { useRef, useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import {
  query,
  collection,
  orderBy,
  limit,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./ChatGroup.css";
import { useParams } from "react-router-dom";
import { getDocumentById } from "../controller/Courses";
import { getMessages } from "../controller/Messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Button } from "primereact/button";

const ChatGroup = () => {
  const messagesRef = collection(db, "messages");
  const endOfMessagesRef = useRef(null); // Ref to maintain the scroll position
  const [formValue, setFormValue] = useState("");
  const { docId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (docId) {
      const q = query(
        collection(db, "messages"),
        where("groupId", "==", docId),
        orderBy("createdAt")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(msgs);
      });

      return () => unsubscribe(); // Clean up the subscription when the component unmounts or docId changes
    }
  }, [docId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Scroll to bottom every time messages update

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid } = auth.currentUser;
    const msg = {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      groupId: docId,
    };

    await addDoc(messagesRef, msg);
    setFormValue("");
  };

  return (
    <div className="Chat">
      <div>
        <h1>Chat for the Group</h1>
      </div>
      <div className="chat-section">
        <div className="chat-main">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={endOfMessagesRef} /> {/* Empty div for scrolling to */}
        </div>

        <form onSubmit={sendMessage} className="message-form">
          <input
            className="message-input"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Say something nice"
          />
          <Button type="submit" className="submit-button" disabled={!formValue}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatGroup;

const ChatMessage = ({ message }) => {
  const { text, uid } = message;
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getDocumentById("user", uid);
      if (userData) {
        setUserImage(userData.imageUrl);
        setUserName(userData.name);
      }
    };

    fetchUserData();
  }, [uid]);

  const isMessageFromCurrentUser = uid === auth.currentUser?.uid;

  return (
    <div
      className={`message ${
        isMessageFromCurrentUser ? "sent-message" : "received-message"
      }`}
    >
      <img src={userImage} alt="Avatar" className="user-avatar" />
      <div className="message-content">
        <div className="message-text">{text}</div>
        <div className="user-name">{userName}</div>
      </div>
    </div>
  );
};
