import React, { useState, useEffect } from "react";
import { getCoursesWithAcceptedInvitations } from "../controller/Groups"; // Import the function
import { useAuth } from "../context/AuthContext";
import { getDocumentById } from "../controller/Courses";
import CardCourse from "./CardCourse";

const GroupsComponent = () => {
  const [courses, setCourses] = useState([]);
  const user = useAuth();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user || !user.uid) {
          console.log("User not authenticated.");
          return;
        }

        const courseDocIds = await getCoursesWithAcceptedInvitations(user.uid);

        const courses = [];
        for (let i = 0; i < courseDocIds.length; i++) {
          const course = await getDocumentById("courses", courseDocIds[i]);
          courses.push(course);
        }
        setCourses(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <div>
      <h2>Groups with accepted invitations:</h2>
      <ul>
        {courses.map((course) => (
          <div>
            <CardCourse
              title={course.title}
              imageUrl={course.imageUrl}
              id={course.docId}
            />

            <li key={course.docId}>{course.title}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default GroupsComponent;
