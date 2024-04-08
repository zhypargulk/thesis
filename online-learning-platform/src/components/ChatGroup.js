import React, { useRef, useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import {
  query,
  collection,
  orderBy,
  limit,
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
  const q = query(messagesRef, orderBy("createdAt"), limit(25));
  // const [messages] = useCollectionData(q, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const { docId } = useParams();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const msgs = await getMessages(docId);
      const sortedMessages = msgs.sort((a, b) => a.createdAt - b.createdAt);

      setMessages(sortedMessages);
    };

    if (docId) {
      fetchMessages();
    }
  }, [docId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      groupId: docId,
    });

    setFormValue("");
  };

  return (
    <div className="Chat">
      <div>
        <h1>Chat for the Group</h1>
      </div>
      <div className="chat-section">
        <div className="chat-section">
          <div className="chat-main">
            {messages &&
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
          </div>

          <form onSubmit={sendMessage} className="message-form">
            <input
              className="message-input"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Say something nice"
            />
            <Button
              type="submit"
              className="submit-button"
              disabled={!formValue}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </form>
        </div>
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
