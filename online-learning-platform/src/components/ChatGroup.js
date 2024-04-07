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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Button } from "primereact/button";

const ChatGroup = () => {
  return (
    <div className="App">
      <div className="">
        <h1>Chat for the Group</h1>
      </div>
      <div className="chat-section">
        <ChatRoom />
      </div>
    </div>
  );
};

export default ChatGroup;

function ChatRoom() {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(25));
  const [messages] = useCollectionData(q, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const { docId } = useParams();

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
    <>
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
          <Button type="submit" className="submit-button" disabled={!formValue}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </form>
      </div>
    </>
  );
}

const ChatMessage = ({ message }) => {
  const { text, uid } = message;
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getDocumentById("user", uid);
      if (userData) {
        setUserImage(userData.imageUrl || "defaultAvatarPath");
        setUserName(userData.name);
      }
    };

    fetchUserData();
  }, [uid]);

  const messageClass =
    uid === auth.currentUser?.uid ? "sent-message" : "received-message";

  return (
    <div className={`message ${messageClass}`}>
      <div className="message-content">
        <div className="message-text">{text}</div>
        <div className="user-name">{userName}</div>
      </div>
      <img src={userImage} alt="Avatar" className="user-avatar" />
    </div>
  );
};
