import { useState, useEffect } from "react";
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

function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [groups, setGroups] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDocRef = doc(db, "user", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserDetails(userDocSnap.data());

        if (userDocSnap.data().profileImageUrl) {
          setProfileImageUrl(userDocSnap.data().profileImageUrl);
        }
      }
    };

    const fetchGroups = async () => {
      const groupsQuery = query(
        collection(db, "groups"),
        where("students", "array-contains", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(groupsQuery);
      const groupsData = [];
      querySnapshot.forEach((doc) => {
        groupsData.push(doc.data().name);
      });
      setGroups(groupsData);
    };

    fetchUserDetails();
    fetchGroups();
  }, []);

  const uploadProfileImage = () => {
    if (!imageUpload) return;
    const imageRef = ref(
      storage,
      `profileImages/${auth.currentUser.uid}/${imageUpload.name + v4()}`
    );
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const userDocRef = doc(db, "user", auth.currentUser.uid);
        // Assuming you have a method to update Firestore document
        // updateUser(userDocRef, { profileImageUrl: url });
        setProfileImageUrl(url);
      });
    });
  };

  return (
    <>
      <MenubarCustom />
      <div>
        <h1>Profile</h1>
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
        </div>
      </div>
    </>
  );
}

export default Profile;
