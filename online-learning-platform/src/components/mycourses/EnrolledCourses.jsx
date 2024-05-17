import React, { useEffect, useState } from "react";
import { fetchMyCourses } from "../../controller/Courses";
import { InputText } from "primereact/inputtext";
import MenubarCustom from "../menu/Menubar";
import img from "../courses/images/earth.png";
import moon from "../courses/images/Planet=Moon.png";
import CardMyCourse from "./CardMyCourse";
import "./EnrolledCourses.css";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMyCourses();
        setCourses(response);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const isCentered = filteredCourses.length > 2;


  return (
    <>
      <MenubarCustom />
      <div className="flex align-items-center justify-content-center mt-4 head-text">
        <span className=" text-6xl course-color">Your enrolled courses</span>
      </div>
      <img src={img} className="absolute top-0 right-0" alt="Earth" />
      <img
        src={moon}
        className="absolute left-0 top-10"
        alt="Moon"
        style={{ width: "100px" }}
      />
      <div className="flex align-items-center justify-content-center mt-4">
        <InputText
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-9 h-4rem border-round-lg border-3 text-lg border-green-900"
          placeholder="Find the course"
        />
      </div>
      <br></br>
      {filteredCourses.length === 0 && (
        <div className="flex align-items-center justify-content-center mt-4">
          <p className=" text-white">You haven't enrolled to any course</p>
        </div>
      )}
    <div className={`grid  ${isCentered ? 'flex justify-content-center ml-4 mt-4' : 'ml-8 mt-6'}`}>
        {filteredCourses.map((course) => (
          <div key={course.docId} className="col-12 col-md-4 w-30rem m-3">
            <CardMyCourse
              title={course.title}
              imageUrl={course.imageUrl}
              desc={course.description}
              id={course.docId}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default EnrolledCourses;
