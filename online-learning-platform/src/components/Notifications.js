import React, { useEffect, useState } from "react";
import { fetchUserData } from "../controller/User";
import { getDocumentById } from "../controller/Courses";
import { Button } from "primereact/button";
import { useAuth } from "../context/AuthContext";
import MenubarCustom from "./Menubar";
import CardCourse from "./courses/CardCourse";
import AcceptGroups from "./AcceptGroups";

const Notificatioins = () => {
  const [coursesWithInvitations, setCoursesWithInvitations] = useState([]);
  const [myInformation, setMyInformation] = useState([]);
  const user = useAuth();

  const listAllInvitations = async () => {
    try {
      if (!user || !user.uid) {
        return;
      }

      const myInfo = await fetchUserData(user.uid);
      setMyInformation(myInfo);
      const coursesWithout = myInfo.groups.filter(
        (group) => !group.acceptedInvitation
      );

      const docIds = coursesWithout.map((group) => group.courseDocId);

      const courses = [];
      for (let i = 0; i < docIds.length; i++) {
        const course = await getDocumentById("courses", docIds[i]);
        courses.push(course);
      }
      setCoursesWithInvitations(courses);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const acceptInvitations = async (docId) => {};

  console.log(coursesWithInvitations);
  useEffect(() => {
    listAllInvitations();
  }, [user]);

  const saveStateToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const loadStateFromLocalStorage = (key) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  useEffect(() => {
    saveStateToLocalStorage("coursesWithInvitations", coursesWithInvitations);
  }, [coursesWithInvitations]);

  useEffect(() => {
    const storedCoursesWithInvitations = loadStateFromLocalStorage(
      "coursesWithInvitations"
    );
    if (storedCoursesWithInvitations) {
      setCoursesWithInvitations(storedCoursesWithInvitations);
    }
  }, []);

  return (
    <div>
      <MenubarCustom />
      <h2>Courses with pending group invitations:</h2>
      <ul>
        {coursesWithInvitations.map((course) => (
          <div>
            <CardCourse title={course.title} imageUrl={course.imageUrl} />
            {/* <AcceptGroups
              title={course.title}
              imageUrl={course.imageUrl}
              desc={course.description}
            /> */}
            <li key={course.courseId}>
              {course.title}
              <div className="flex flex-row mt-3">
                <Button className="flex" label="Decline" />
                <Button
                  className="flex ml-5"
                  label="Accept"
                  onClick={() => acceptInvitations(course.docId)}
                />
              </div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Notificatioins;
