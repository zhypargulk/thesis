// MenubarCustom.js
import React from "react";
import { Menubar } from "primereact/menubar";
import "./MenubarCustom.css"; // Import CSS file

export default function MenubarCustom() {
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
    },
    {
      label: "Create a course",
      icon: "pi pi-plus",
    },
    {
      label: "Courses",
      icon: "pi pi-search",
      items: [
        {
          label: "Components",
          icon: "pi pi-bolt",
        },
        {
          label: "Blocks",
          icon: "pi pi-server",
        },
        {
          label: "UI Kit",
          icon: "pi pi-pencil",
        },
        {
          label: "Templates",
          icon: "pi pi-palette",
          items: [
            {
              label: "Apollo",
              icon: "pi pi-palette",
            },
            {
              label: "Ultima",
              icon: "pi pi-palette",
            },
          ],
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
    },
  ];

  return (
    <div className="menubar-custom">
      <Menubar model={items} />
    </div>
  );
}
