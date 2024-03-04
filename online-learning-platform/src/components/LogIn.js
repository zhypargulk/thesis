import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import CSS file

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      // Sign in the user with email and password
      await signInWithEmailAndPassword(auth, email, password);
      // Reset input fields after successful login
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error.message);
      // Handle error (display error message to the user, etc.)
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Please login the User</h2>
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
        <Button className="login-button" label="Sign in" onClick={signIn} />
      </div>
    </div>
  );
};

export default LogIn;
