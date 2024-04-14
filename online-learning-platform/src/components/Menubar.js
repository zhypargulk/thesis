import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../config/firebase"; // Ensure your Firebase config is correctly set up
import { signOut } from "firebase/auth";
import "./MenubarCustom.css";

export default function MenubarCustom() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [authExist, setAuthExist] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.displayName) {
        const newRole = user.displayName.split("-")[1].trim();
        setRole(newRole);
        setAuthExist(true);
      } else {
        console.log("No Display Name found.");
        setRole("");
        setAuthExist(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNavigation = (url) => {
    navigate(url);
    setActiveItem(url);
  };

  const items = [
    {
      label: (
        <p
          className={`text-900 hover-label  ${
            activeItem === "/" ? "underline" : ""
          }`}
        >
          Home
        </p>
      ),
      icon: "pi pi-home",
      command: () => handleNavigation("/"),
    },
    {
      label:
        role === "Teacher" ? (
          <p
            className={`text-900 hover-label ${
              activeItem === "/create" ? "underline" : ""
            }`}
          >
            Create a course
          </p>
        ) : (
          <p
            className={`text-900 hover-label ${
              activeItem.includes("/courses") ? "underline" : ""
            }`}
          >
            Find a course
          </p>
        ),
      icon: role === "Teacher" ? "pi pi-plus" : "pi pi-search",
      command: () =>
        handleNavigation(role === "Teacher" ? "/create" : "/courses"),
    },
    {
      label: (
        <p
          className={`text-900 hover-label ${
            activeItem === "/profile" ? "underline" : ""
          }`}
        >
          Profile
        </p>
      ),
      icon: "pi pi-user",
      command: () => handleNavigation("/profile"),
    },
    {
      label: (
        <p
          className={`text-900 hover-label ${
            activeItem === "/notifications" ? "underline" : ""
          }`}
        >
          Notifications
        </p>
      ),
      icon: "pi pi-bell",
      command: () => handleNavigation("/notifications"),
    },
    {
      label: (
        <p
          className={`text-900 hover-label ${
            activeItem.includes("/groups") ? "underline" : ""
          }`}
        >
          Groups
        </p>
      ),
      icon: "pi pi-users",
      command: () => handleNavigation("/groups"),
    },
  ];

  const logoOnly = [
    {
      label: <p className="text-2xl text-primary-900">collabLearn</p>,
      icon: "pi pi-users",
    },
  ];

  const start = (
    <div className="brand-container">
      <span className="brand-text text-teal-800">collabLearn</span>
    </div>
  );

  const end = (
    <>
      {authExist ? (
        <Button
          className="p-button-rounded "
          label="Logout"
          icon="pi pi-sign-out"
          onClick={() => signOut(auth).then(() => navigate("/login"))}
          text
        />
      ) : (
        <Button
          className="p-button-rounded "
          label="Sign-in/Login"
          icon="pi pi-sign-out"
          onClick={() => navigate("/login")}
          text
        />
      )}
    </>
  );

  return (
    <header className=" menubar-custom">
      <div className="">
        {authExist ? (
          <Menubar model={items} start={start} end={end} />
        ) : (
          <Menubar model={logoOnly} />
        )}
      </div>
    </header>
  );
}
