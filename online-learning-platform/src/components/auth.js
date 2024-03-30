import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../config/firebase";
import { updateProfile } from "firebase/auth"; // Import updateProfile
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { Password } from "primereact/password";

import "./Auth.css"; // Import CSS file

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const roles = [
    {
      role: "Teacher",
    },
    {
      role: "Student",
    },
  ];

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setRole("");
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const getIsFormValid = () => {
    return (
      name && validateEmail(email) && password.length >= 8 && role.role !== ""
    );
  };

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateUserProfile(userCredential.user, {
        displayName: `${name} - ${role.role}`,
      });

      await addUserToFirestore(userCredential.user.uid, {
        name,
        email,
        role: role.role,
        id: userCredential.user.uid,
      });

      clearForm();
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  const updateUserProfile = async (user, profile) => {
    await updateProfile(user, profile);
  };

  const addUserToFirestore = async (userId, userData) => {
    const firestore = getFirestore();
    await setDoc(doc(firestore, "user", userId), userData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register();
  };

  return (
    <div className="auth-container">
      {/* <div className="form-container"> */}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <h2>Register the User</h2>
          <div className="Field">
            <label>
              First and last name <sup>*</sup>
            </label>
            <InputText
              className="input-field"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="Field">
            <label>
              Email address<sup>*</sup>
            </label>
            <InputText
              className="input-field"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="Field">
            <label>
              Password<sup>*</sup>
            </label>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={true}
              toggleMask
              className="input-field"
            />
            {password.length < 8 && password.length > 1 ? (
              <p className="FieldError">
                Password should have at least 8 characters
              </p>
            ) : null}
          </div>
          <div className="Field">
            <label>
              Role<sup>*</sup>
            </label>
            <Dropdown
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={roles}
              optionLabel="role"
              placeholder="Select a role"
              className="input-field bg-white"
              panelStyle={{ backgroundColor: "white" }}
            />
          </div>
          <Button
            className="register-button"
            label="Create account"
            type="submit"
            disabled={!getIsFormValid()}
          />
        </fieldset>
      </form>
    </div>
    // </div>
  );
};

export default Auth;
