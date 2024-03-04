import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../config/firebase";
import { updateProfile } from "firebase/auth"; // Import updateProfile
import { getFirestore, doc, setDoc } from "firebase/firestore";
import "./Auth.css"; // Import CSS file

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  //   onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //   });

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateUserProfile(userCredential.user, {
        displayName: `${name} - ${role}`,
      });

      await addUserToFirestore(userCredential.user.uid, { name, email, role });

      setEmail("");
      setPassword("");
      setName("");
      setRole("");
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  const updateUserProfile = async (user, profile) => {
    await updateProfile(user, profile);
  };

  const addUserToFirestore = async (userId, userData) => {
    const firestore = getFirestore();
    await setDoc(doc(firestore, "users", userId), userData);
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h2>Register the User</h2>
        <InputText
          className="input-field"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputText
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputText
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputText
          className="input-field"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Button
          className="register-button"
          label="Register"
          onClick={register}
        />
      </div>
    </div>
  );
};

export default Auth;
