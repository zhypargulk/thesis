import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp_rlWl4dBkGxXfibgjfcG1vVzTD_xu1c",
  authDomain: "login-with-firebase-a2f07.firebaseapp.com",
  projectId: "login-with-firebase-a2f07",
  storageBucket: "login-with-firebase-a2f07.appspot.com",
  messagingSenderId: "16612816483",
  appId: "1:16612816483:web:3f316ce4b862068fdf6a56",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
