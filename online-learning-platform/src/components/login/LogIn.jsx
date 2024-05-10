import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useRef } from "react";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Message } from "primereact/message";
import "./Login.css";
import MenubarCustom from "../menu/Menubar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [invalidInputClass, setInvalidInputClass] = useState("");
  const navigate = useNavigate();
  const toast = useRef(null);

  const showError = (summary, detail) => {
    toast.current.show({
      severity: "error",
      summary: summary,
      detail: detail,
      life: 3000,
    });
  };

  const signIn = async () => {
    if (!email) {
      setEmailError("Email is required");
      setInvalidInputClass("p-invalid");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      setInvalidInputClass("p-invalid");
    } else {
      setPasswordError("");
    }

    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setEmail("");
        setPassword("");
        navigate("/");
      } catch (error) {
        console.error("Error signing in:", error.message);
        showError("Login Failed", error.message);
      }
    }
  };

  const onClickCreateNewAccount = () => {
    navigate("/register");
  };

  return (
    <>
      <>
        <MenubarCustom />
        <Toast ref={toast} />
        <div className="page-container-login">
          <div className="card-login">
            <h2 className="mt-0">
              Welcome Back! <FontAwesomeIcon icon={faLaptopCode} />
            </h2>

            <div className="flex-column-login">
              <InputText
                className={`w-30rem ${invalidInputClass} text-lg`}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                
              />
              {emailError && <Message severity="error" text={emailError} />}
            </div>

            <div className="flex-column-login">
              <InputText
                className={`w-30rem ${invalidInputClass} text-lg mt-3`}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <Message severity="error" text={passwordError} />
              )}
            </div>

            <Button
              className="w-30rem p-3 text-lg mt-4"
              label="Sign in"
              onClick={signIn}
            />
            <Button
              className="w-30rem p-button-text mt-3 text-link"
              label="Create a new account"
              onClick={onClickCreateNewAccount}
              link
              text
            />
          </div>
        </div>
      </>
    </>
  );
};

export default LogIn;
