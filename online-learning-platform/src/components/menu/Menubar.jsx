import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../config/firebase"; // Ensure your Firebase config is correctly set up
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

  const items =
    role === "Teacher"
      ? [
          {
            label: (
              <p
                className={`text-white hover-label  ${
                  activeItem === "/" ? "underline" : ""
                }`}
              >
                Home
              </p>
            ),
            icon: (
              <p>
                <i className="pi pi-home mr-2"></i>
              </p>
            ),
            command: () => handleNavigation("/"),
          },
          {
            label: (
              <p
                className={`text-white hover-label ${
                  activeItem === "/create" ? "underline" : ""
                }`}
              >
                Create a course
              </p>
            ),
            icon: (
              <p>
                <i className="pi pi-plus mr-2"></i>
              </p>
            ),
            command: () => handleNavigation("/create"),
          },
          {
            label: (
              <p
                className={`text-white hover-label ${
                  activeItem === "/profile" ? "underline" : ""
                }`}
              >
                Profile
              </p>
            ),
            icon: (
              <p>
                <i className="pi pi-user mr-2"></i>
              </p>
            ),
            command: () => handleNavigation("/profile"),
          },

          {
            label: (
              <p
                className={`text-white hover-label ${
                  activeItem === "/createdcourses" ? "underline" : ""
                }`}
              >
                My created courses
              </p>
            ),
            icon: (
              <p>
                <i className="pi pi-book mr-2"></i>
              </p>
            ),
            command: () => handleNavigation("/createdcourses"),
          },
        ]
      : [
          {
            label: (
              <p
                className={`text-white hover-label  ${
                  activeItem === "/" ? "underline" : ""
                }`}
              >
                Home
              </p>
            ),
            icon: (
              <p>
                <i className="pi pi-home mr-2"></i>
              </p>
            ),
            command: () => handleNavigation("/"),
          },
          {
            label: (
              <p
                className={`text-white hover-label ${
                  activeItem.includes("/courses") ? "underline" : ""
                }`}
              >
                Find a course
              </p>
            ),
            icon: (
              <p>
                <i className="pi pi-search mr-2"></i>
              </p>
            ),
            command: () =>
              handleNavigation(role === "Teacher" ? "/create" : "/courses"),
          },
          {
            label: (
              <p
                className={`text-white hover-label ${
                  activeItem === "/profile" ? "underline" : ""
                }`}
              >
                Profile
              </p>
            ),
            icon: (
              <p>
                <i className="pi pi-user mr-2"></i>
              </p>
            ),
            command: () => handleNavigation("/profile"),
          },
          {
            label: (
              <p
                className={`text-white hover-label ${
                  activeItem === "/mycourses" ? "underline" : ""
                }`}
              >
                Enrolled courses
              </p>
            ),
            icon: (
              <p>
                <i className="pi pi-book mr-2"></i>
              </p>
            ),
            command: () => handleNavigation("/mycourses"),
          },
          {
            label: (
              <p
                className={`text-white hover-label ${
                  activeItem.includes("/groups") ? "underline" : ""
                }`}
              >
                Groups
              </p>
            ),
            icon: (
              <p>
                <i className="pi pi-users mr-2"></i>
              </p>
            ),
            command: () => handleNavigation("/groups"),
          },
        ];

  const logoOnly = [
    {
      label: <p className="text-2xl text-white">collabLearn</p>,
      icon: (
        <p>
          <i className="pi pi-users mr-2"></i>
        </p>
      ),
    },
  ];

  const start = (
    <div className="brand-container">
      <span className="brand-text text-white">collabLearn</span>
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
    <header className="menubar-custom">
      {authExist ? (
        <Menubar model={items} start={start} end={end} />
      ) : (
        <Menubar model={logoOnly} />
      )}
    </header>
  );
}
