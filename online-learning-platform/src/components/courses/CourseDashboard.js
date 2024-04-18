import React, { useEffect, useState } from "react";
import { fetchCourses } from "../../controller/Courses";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import MenubarCustom from "../Menubar";
import CardCourse from "./CardCourse";
import "./CourseDashboard.css";

const CourseDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCourses();
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

  return (
    <>
      <MenubarCustom />
      <div className="flex align-items-center justify-content-center mt-4 head-text">
        <span className="text-teal-800 text-6xl">Course Dashboard</span>
      </div>
      <div className="flex align-items-center justify-content-center mt-4">
        <InputText
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-9 h-4rem border-round-lg border-3 text-lg border-green-900"
          placeholder="Find the course"
        />
      </div>
      <div className="grid m-3">
        {filteredCourses.map((course) => (
          <div key={course.courseId} className="col-12 col-md-4 w-30rem m-3">
            <CardCourse
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

export default CourseDashboard;
