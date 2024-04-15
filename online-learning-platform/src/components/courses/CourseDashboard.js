import React, { useEffect, useState } from "react";
import { fetchCourses } from "../../controller/Courses";
import { Card } from "primereact/card";

import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import MenubarCustom from "../Menubar";
import CardCourse from "./CardCourse";
import AcceptGroups from "../AcceptGroups";
import "./CourseDashboard.css";

const CourseDashboard = () => {
  const [courses, setCourses] = useState([]);
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

  return (
    <>
      <MenubarCustom />
      <div>
        <div className="flex align-items-center justify-content-center mt-4 head-text">
          <span className="text-teal-800 text-6xl">Course Dashboard</span>
        </div>
        <div className="flex align-items-center justify-content-center mt-4 head-text">
          <div className="card w-11 card-course">
            <div className="p-grid p-fluid mt-8">
              {courses.map((course) => (
                <div key={course.courseId} className="p-col-12 p-md-6 p-lg-6">
                  <CardCourse
                    title={course.title}
                    imageUrl={course.imageUrl}
                    desc={course.description}
                    id={course.docId}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDashboard;
