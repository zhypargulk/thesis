import { useState, useEffect, useRef } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage, auth, db } from "../config/firebase";
import { v4 } from "uuid";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Button } from "primereact/button";
import MenubarCustom from "./Menubar";
import { updateProfileData, userPasswordReset } from "../controller/User";
import { useAuth } from "../context/AuthContext";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import "./Profile.css";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";

function Profile() {
  const [userDetails, setUserDetails] = useState();
  const [imageUpload, setImageUpload] = useState(null);
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

  const onSubmitHandler = async () => {
    if (passwordNew === passwordNew2) {
      const user = auth.currentUser;
      const result = await userPasswordReset(user, passwordNew);

      show();
      setPasswordNew("");
      setPasswordNew2("");
    } else {
      error();
      setPasswordNew("");
      setPasswordNew2("");
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
                  {/* This wrapper ensures button alignment */}
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
              <h2 className="name">{userDetails.name}</h2>
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
                    weakLabel="Too simple"
                    mediumLabel="Average complexity"
                    strongLabel="Complex password"
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
                    weakLabel="Too simple"
                    mediumLabel="Average complexity"
                    strongLabel="Complex password"
                  />
                  <Button
                    label="Reset password"
                    type="submit"
                    icon="pi pi-check"
                    className="mt-4"
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
{
  /* <h1>Profile</h1>
        <p>Full Name: userDetails.fullName</p>
        <h2>Groups</h2>
        <ul>
          {groups.map((group, index) => (
            <li key={index}>{group}</li>
          ))}
        </ul>
        <div>
          {profileImageUrl && (
            <img
              src={profileImageUrl}
              alt="Profile"
              style={{ width: "100px", height: "100px" }}
            />
          )}
          <input
            type="file"
            onChange={(event) => setImageUpload(event.target.files[0])}
          />
          <Button label="Upload Image" onClick={uploadProfileImage} />
        </div> */
}
