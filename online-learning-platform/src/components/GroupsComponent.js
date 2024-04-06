import React, { useState, useEffect } from "react";
import {
  getCoursesWithAcceptedInvitations,
  getCoursesByUserId,
  getGroupByUserIdAndCourseId,
} from "../controller/Groups"; // Import the function
import { useAuth } from "../context/AuthContext";
import { getDocumentById } from "../controller/Courses";
import CardGroup from "./CardGroup";
import MenubarCustom from "./Menubar";

const GroupsComponent = () => {
  const [courses, setCourses] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const user = useAuth();
  const [userId, setUserId] = useState();

  useEffect(() => {
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
    <>
      <MenubarCustom />
      <div>
        <h2 className="m-5">Your Group Projects</h2>
        <div className="grid m-3">
          {courses.map((course, index) => (
            <div key={course.docId} className="col-12 col-md-4 w-30rem m-3">
              <CardGroup
                key={course.docId}
                title={course.title}
                imageUrl={course.imageUrl}
                id={course.docId}
                groupId={groupes[index] ? groupes[index].groupDocId : null}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GroupsComponent;
