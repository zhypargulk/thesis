import React, { useState, useRef } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { auth } from "../../config/firebase";
import MenubarCustom from "../menu/Menubar";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate('/login');

  const showError = (summary, detail) => {
    toast.current.show({
      severity: "error",
      summary: summary,
      detail: detail,
      life: 3000,
    });
  };

  const showSuccess = (summary, detail) => {
    toast.current.show({
      severity: "success",
      summary: summary,
      detail: detail,
      life: 3000,
    });
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setEmailError("Please enter your email to reset password");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailError("");
      navigate('/login');

      showSuccess("Reset Email Sent", "Please check your email to reset your password");
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      showError("Error", error.message);
    }
  };

  return (
    <>
      <MenubarCustom />
      <Toast ref={toast} className="custom-toast" />
      <div className="page-container-reset">
        <div className="card-reset">
          <h2>Reset Password</h2>
          <div className="flex-column-reset">
            <InputText
              className={`w-30rem text-lg ${emailError ? "p-invalid" : ""}`}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error-text">{emailError}</p>}
          </div>
          <Button
            className="w-30rem p-3 text-lg mt-4"
            label="Send reset password email"
            onClick={handlePasswordReset}
          />
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
