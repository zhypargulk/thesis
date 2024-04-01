import React, { useState, useEffect } from "react";
import {
  getCoursesWithAcceptedInvitations,
  getCoursesByUserId,
  getGroupByUserIdAndCourseId,
} from "../controller/Groups"; // Import the function
import { useAuth } from "../context/AuthContext";
import { getDocumentById } from "../controller/Courses";
import CardCourse from "./CardCourse";

const GroupsComponent = () => {
  const [courses, setCourses] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const user = useAuth();
  const [userId, setUserId] = useState();

  useEffect(() => {
    // Ensure user is not null before accessing its properties
    if (user) {
      setUserId(user.uid);
    }
  }, [user]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (userId) {
          const courseDocIds = await getCoursesByUserId(userId);
          const courses = [];
          const groups = [];
          for (let i = 0; i < courseDocIds.length; i++) {
            const course = await getDocumentById("courses", courseDocIds[i]);
            const group = await getGroupByUserIdAndCourseId(
              userId,
              course.docId
            );
            courses.push(course);
            groups.push(group);
          }
          setCourses(courses);
          setGroupes(groups);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [userId]);

  return (
    <div>
      <h2>Groups with accepted invitations:</h2>
      <ul>
        {courses.map((course, index) => {
          console.log("Index:", index, "Course:", course);
          return (
            <div key={course.docId}>
              <CardCourse
                title={course.title}
                imageUrl={course.imageUrl}
                id={course.docId}
                groupId={groupes[index] ? groupes[index].groupDocId : null} // Pass the groupId as a prop
              />
              <li>{course.title}</li>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default GroupsComponent;
