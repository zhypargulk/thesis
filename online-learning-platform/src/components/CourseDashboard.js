import React, { useEffect, useState } from "react";
import { fetchCourses } from "../controller/Courses";
import { Card } from "primereact/card";

import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import MenubarCustom from "./Menubar";
import CardCourse from "./CardCourse";
import AcceptGroups from "./AcceptGroups";

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

  const onHandleButton = (id) => {
    navigate(id);
  };

  return (
    <div>
      <MenubarCustom />
      <h2>Course Dashboard</h2>
      <div className="p-grid p-fluid">
        {courses.map((course) => (
          <div key={course.courseId} className="p-col-12 p-md-4 p-lg-3">
            <Card>
              <CardCourse
                title={course.title}
                imageUrl={course.imageUrl}
                desc={course.description}
              />

              <Button
                label={course.title}
                onClick={() => onHandleButton(course.docId)}
              />
              {/* {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              )} */}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDashboard;
