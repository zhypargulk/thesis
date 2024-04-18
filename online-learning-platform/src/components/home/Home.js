import { useState, useRef, useEffect } from "react";
import MenubarCustom from "../Menubar";
import home_img from "./images/home-img.jpg";
import "./Home.css";
import Writer from "./Writer.js";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { auth } from "../../config/firebase";

export default function Home() {
  const text =
    "Innovative online learning platform, designed to enhance " +
    "collaborative learning in virtual environments. Our intuitive " +
    "interface supports effective teamwork for students engaging in " +
    "programming and other courses, promoting practical skills in project " +
    "management and organization. Students can work in teams, dividing " +
    "tasks like in real-life projects, with roles such as team leaders to " +
    "foster leadership skills. Our approach not only enhances learning " +
    "engagement but also boosts retention. Join us to experience a new " +
    "era of engaged, practical education.";
  const navigate = useNavigate();
  const [authExist, setAuthExist] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.displayName) {
        setAuthExist(true);
      } else {
        setAuthExist(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <MenubarCustom />
      <div className="">
        <div className="flex mt-5">
          <img
            src={home_img}
            alt="Descriptive Alt Text"
            className="w-6 h-6 ml-3 mt-5"
          />
          <div className="flex flex-column justify-content-center ml-5 w-6">
            <h3 className=" text-home">
              <span className="text-teal-800 text-home"> Welcome!</span> It is
              an online learning platform for{" "}
              <span className="text-teal-800 text-home">students</span>.
            </h3>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                textAlign: "center",
                padding: "50px",
              }}
            >
              <Writer text={text} speed={30} />
            </div>
            {!authExist ? (
              <Button
                className=" w-full mt-5 "
                label="Register/Login"
                onClick={() => navigate("/login")}
              />
            ) : (
              <Button
                className=" w-full mt-5 mr-3 font-semibold"
                label="Explore courses"
                onClick={() => navigate("/courses")}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
