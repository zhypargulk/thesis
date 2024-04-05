import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState, useRef } from "react";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Message } from "primereact/message";

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
      <div className="flex align-items-center flex-column gap-4 min-height-200 mt-8">
        <div className="flex flex-column w-10 lg:w-8">
          <div className=" p-4">
            <Toast ref={toast} />

            <h2>Login</h2>
            <div className="flex align-items-center gap-2 mb-3">
              <div className="flex-grow-1">
                <InputText
                  className={`w-30rem ${invalidInputClass} text-lg`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <Message severity="error" text={emailError} />}
              </div>
            </div>

            <div className="flex align-items-center gap-2 mb-3">
              <div className="flex-grow-1">
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
            </div>
            <Button
              className="w-30rem p-3 text-lg mt-4"
              label="Sign in"
              onClick={signIn}
            />
          </div>
          <div className="flex justify-content-start">
            <Button
              className=" p-button-text mt-3 "
              label="Create a new account"
              onClick={onClickCreateNewAccount}
              link
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
