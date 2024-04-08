import React from "react";
import MenubarCustom from "./Menubar";

export default function Home() {
  return (
    <>
      <MenubarCustom />
      <div className="flex flex-column flex-wrap mt-5">
        <h3 className="flex align-items-center justify-content-center">
          Hello! This is an online learning platform for students.
        </h3>
        <br></br>
        <h3 className="flex align-items-center justify-content-center">
          Here, you are able not only take courses but also work in a group
          projects with other students
        </h3>

        <h3 className="flex align-items-center justify-content-center">
          Start exploring more about this web page
        </h3>
      </div>
    </>
  );
}
