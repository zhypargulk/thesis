import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage, auth } from "../config/firebase";
import { v4 } from "uuid";
import { signOut } from "firebase/auth";
import { Button } from "primereact/button";

function Profile() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);
  const logout = async () => {
    await signOut(auth);

    // Clear user role from local storage and reset state
    localStorage.removeItem("userRole");
  };

  return (
    <div className="App">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={uploadFile}> Upload Image</button>
      {imageUrls.map((url) => {
        return <img src={url} />;
      })}
      <Button label="Logout" onClick={logout} />
    </div>
  );
}

export default Profile;

// // import { useState, useEffect } from "react";
// // import { auth } from "../config/firebase";
// // import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { useState, useEffect } from "react";
// import { auth } from "../config/firebase";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { FileUpload } from "primereact/fileupload";
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   listAll,
//   list,
// } from "firebase/storage";
// import { storage } from "../config/firebase";
// import { v4 } from "uuid";

// import { useUserRole } from "./UserRoleContext";
// import { Button } from "primereact/button";
// import { signOut, onAuthStateChanged } from "firebase/auth";

// const Profile = () => {
//   const [userRole, setUserRole] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState({});

//   onAuthStateChanged(auth, (currentUser) => {
//     setUser(currentUser);
//   });

//   useEffect(() => {
//     console.log("useEffect hook triggered");
//     const fetchUserRole = async () => {
//       if (auth.currentUser) {
//         try {
//           const firestore = getFirestore();
//           const userDoc = await getDoc(
//             doc(firestore, "users", auth.currentUser.uid)
//           );
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setUserRole(userData.role);

//             // Store user role in local storage
//             localStorage.setItem("userRole", userData.role);
//           } else {
//             console.error("User data not found.");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error.message);
//         } finally {
//           setLoading(false); // Set loading to false after fetching user data
//         }
//       }
//     };

//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     // Retrieve user role from local storage on component mount
//     const storedUserRole = localStorage.getItem("userRole");
//     if (storedUserRole) {
//       setUserRole(storedUserRole);
//       setLoading(false);
//     }
//   }, []);

//   const userRoles = useUserRole();

//   const logout = async () => {
//     await signOut(auth);

//     // Clear user role from local storage and reset state
//     localStorage.removeItem("userRole");
//     setUserRole("");
//   };

//   const [imageUpload, setImageUpload] = useState(null);
//   const [imageUrls, setImageUrls] = useState([]);

//   const imagesListRef = ref(storage, "images/");
//   const uploadFile = () => {
//     if (imageUpload == null) console.log("it is null");
//     const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
//     // uploadBytes(imageRef, imageUpload).then((snapshot) => {
//     //   getDownloadURL(snapshot.ref).then((url) => {
//     //     setImageUrls((prev) => [...prev, url]);
//     //   });
//     // });
//     uploadBytes(imageRef, imageUpload).then(() => {
//       alert("Image Uploaded");
//     });
//   };

//   // useEffect(() => {
//   //   listAll(imagesListRef).then((response) => {
//   //     response.items.forEach((item) => {
//   //       getDownloadURL(item).then((url) => {
//   //         setImageUrls((prev) => [...prev, url]);
//   //       });
//   //     });
//   //   });
//   // }, []);

//   return (
//     <div>
//       {/* <h2>User Role: {userRoles}</h2>

//       <h1>Welcome to Dashboard</h1>
//       {<p>Hello, {auth.currentUser?.displayName}</p>}
//       <p>Your role: {userRole}</p>

//       <Button label="Logout" onClick={logout} /> */}

//       <input
//         type="file"
//         onChange={(event) => {
//           setImageUpload(event.target.files[0]);
//         }}
//       />

//       <button onClick={uploadFile}> Upload Image</button>
//       {imageUrls.map((url) => {
//         return <img src={url} />;
//       })}
//     </div>
//   );
// };

// export default Profile;
