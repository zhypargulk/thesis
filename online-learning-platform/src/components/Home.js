import React, { useRef, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  query,
  collection,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import MenubarCustom from "./Menubar";
import { useCollectionData } from "react-firebase-hooks/firestore";
export default function Home() {
  return (
    <>
      <MenubarCustom />
      <div className="flex flex-column flex-wrap mt-5">
        <h3 className="flex align-items-center justify-content-center">
          Hello! This is an online learning platform for students.
        </h3>
        <br></br>
        <h3 className="flex align-items-center justify-content-center">
          Here, you are able not only take courses but also work in a group
          projects with other students
        </h3>

        <h3 className="flex align-items-center justify-content-center">
          Start exploring more about this web page
        </h3>
      </div>
      <div className="App">
        <header>
          <h1>⚛️🔥💬</h1>
        </header>

        <section>
          {" "}
          <ChatRoom />{" "}
        </section>
      </div>
    </>
  );
}

function ChatRoom() {
  const dummy = useRef();

  // Create a reference to the "messages" collection
  const messagesRef = collection(db, "messages");

  // Create a query against the collection.
  const q = query(messagesRef, orderBy("createdAt"), limit(25));

  const [messages, loading, error] = useCollectionData(q, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Say something nice"
        />
        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
}
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser?.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={
          photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
        }
        alt="Avatar"
      />
      <p>{text}</p>
    </div>
  );
}
