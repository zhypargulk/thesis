import { useState, useEffect, useRef } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage, auth, db } from "../../config/firebase";
import { v4 } from "uuid";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { Button } from "primereact/button";
import MenubarCustom from "../menu/Menubar";
import { updateProfileData, userPasswordReset } from "../../controller/User";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";

function Profile() {
  const [userDetails, setUserDetails] = useState();
  const [passwordError, setPasswordError] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState();
  const [passwordNew, setPasswordNew] = useState();
  const [passwordNew2, setPasswordNew2] = useState();
  const user = useAuth();
  const toast = useRef(null);

  const show = () => {
    toast.current.show({
      severity: "success",
      summary: "Success!",
      detail: "Password changed successfully",
    });
  };

  const error = () => {
    toast.current.show({
      severity: "error",
      summary: "Error!",
      detail: "Password has not been changed",
    });
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && user.uid) {
        const userDocRef = doc(db, "user", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserDetails(userDocSnap.data());
          setProfileImageUrl(userDocSnap.data().imageUrl);
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  const fileInputRef = useRef(null);
  const onFileInputClick = () => {
    fileInputRef.current.click();
  };

  const uploadProfileImage = async (file) => {
    if (!file) return;
    const imageName = `${file.name}_${v4()}`;
    const imageRef = ref(
      storage,
      `profileImages/${auth.currentUser.uid}/${imageName}`
    );
    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    await updateProfileData(doc(db, "user", auth.currentUser.uid), {
      imageUrl: url,
    });
    setProfileImageUrl(url);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber 
      
    ) {
      return true;
    } else {
      return false;
    }
  };


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (passwordNew === passwordNew2) {
      if (!validatePassword(passwordNew)) {

        toast.current.show({
          severity: "error",
          summary: "Error!",
          detail: "Password must be at least 8 chars and include upper/lower case letters, numbers, and special characters.",
        });
        return;
      }
      const user = auth.currentUser;
      const result = await userPasswordReset(user, passwordNew);

      show();
      setPasswordNew("");
      setPasswordNew2("");
      setPasswordError('')
    } else {
      error();
      setPasswordNew("");
      setPasswordNew2("");
      toast.current.show({
        severity: "error",
        summary: "Error!",
        detail: "Passwords do not match.",
      });
    }
  };

  return (
    <>
      <MenubarCustom />
      <Toast ref={toast} />
      <div className="parent-container">
        {userDetails && (
          <div className="card">
            <div className="image-content">
              <span className="overlay"></span>
              <div className="image-edit-container">
                <div className="card-image">
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="card-img"
                  />
                </div>
                <div className="button-under-left">
                  {" "}
                  <Button
                    icon="pi pi-pencil"
                    label="Edit image"
                    className="p-button-rounded p-button-success"
                    onClick={onFileInputClick}
                  />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    uploadProfileImage(file);
                  }
                }}
              />
            </div>

            <div className="card-content">
            <div className="user-details">
              <h3 className="name">Name: {userDetails.name}</h3>
              <h3 className="name">Role: {userDetails.role}</h3>
            </div>
              <p className="description">{userDetails.email}</p>

              <div className=" flex justify-content-center">
                <form
                  onSubmit={onSubmitHandler}
                  className="flex flex-column gap-2"
                >
                  <label htmlFor="value">Password</label>

                  <Password
                    inputId="in_value"
                    name="value"
                    rows={5}
                    cols={30}
                    value={passwordNew}
                    onChange={(e) => setPasswordNew(e.target.value)}
                    toggleMask
                    promptLabel="Choose a password"
                    feedback={true}
                  
                  />
                   
                  <label htmlFor="value">New password</label>

                  <Password
                    inputId="in_value"
                    name="value"
                    rows={5}
                    cols={30}
                    value={passwordNew2}
                    onChange={(e) => setPasswordNew2(e.target.value)}
                    toggleMask
                    promptLabel="Choose a password"
                    feedback={true}
                    
                  />

                  <Button
                    label="Reset password"
                    type="submit"
          
                    className="mt-4"
                    disabled={!passwordNew  || !passwordNew2 }
                  />
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
