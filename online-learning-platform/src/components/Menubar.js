import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { Button } from "primereact/button";
import { signOut } from "firebase/auth";

import "./MenubarCustom.css"; // Import CSS file

export default function MenubarCustom() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.displayName) {
        const newRole = user.displayName.split("-")[1].trim();

        setRole(newRole);
      } else {
        console.log("No Display Name found.");
        setRole("");
      }
    });

    return () => unsubscribe();
  }, []);

  const createCourse = () => {
    handleNavigation("/create");
  };

  const findCourse = () => {
    handleNavigation("/dashboard");
  };

  const handleNavigation = (url) => {
    navigate(url);
  };

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: role === "Teacher" ? "Create a course" : "Find a course",
      icon: role === "Teacher" ? "pi pi-plus" : "pi pi-search",
      command: role === "Teacher" ? createCourse : findCourse,
    },
    {
      label: "Courses",
      icon: "pi pi-search",
      items: [
        {
          label: "Find course",
          icon: "pi pi-search",
          command: () => navigate("/courses"),
        },
        {
          label: "Blocks",
          icon: "pi pi-server",
        },
      ],
    },
    {
      label: "Contact",
      icon: "pi pi-envelope",
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => navigate("/profile"),
    },
  ];

  const logout = async () => {
    await signOut(auth);

    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const end = (
    <Button
      className="button-log-out"
      label="Logout"
      icon="pi pi-sign-out"
      onClick={logout}
    />
  );

  return (
    <div className="menubar-custom">
      <Menubar model={items} end={end} />
    </div>
  );
}
