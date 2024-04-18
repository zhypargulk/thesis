import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import { auth } from "../../config/firebase";
import {
  checkUserEnrollment,
  enrollUserInCourse,
  getDocumentById,
} from "../../controller/Courses";
import MenubarCustom from "../Menubar";
import { Image } from "primereact/image";
import { ScrollPanel } from "primereact/scrollpanel";
import "./CourseDetails.css"; // Make sure this import is correct

const CourseDetails = () => {
  const [enrolled, setEnrolled] = useState(false);
  const [course, setCourse] = useState(null);
  const { docId } = useParams();

  useEffect(() => {
    const fetchCourseAndCheckEnrollment = async () => {
      try {
        const selectedCourse = await getDocumentById("courses", docId);
        if (selectedCourse) {
          setCourse(selectedCourse);

          const user = auth.currentUser;
          if (user) {
            const uid = user.uid;
            const isEnrolled = await checkUserEnrollment(
              uid,
              selectedCourse.docId
            );
            setEnrolled(isEnrolled);
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseAndCheckEnrollment();
  }, [docId]);

  const handleEnroll = async () => {
    try {
      if (!auth.currentUser) {
        console.error("Error: Current user is undefined");
        return;
      }

      const uid = auth.currentUser.uid;
      const success = await enrollUserInCourse(uid, course.docId);
      if (success) {
        setEnrolled(true);
      } else {
        console.error("Failed to enroll user in course");
      }
    } catch (error) {
      console.error("Error enrolling student:", error);
    }
  };

  return (
    <>
      <MenubarCustom />

      <div className="p-grid p-fluid">
        <div className="p-col-12 p-md-6">
          {course && (
            <div className="full-height-card">
              <div className="flex align-items-center justify-content-center mt-4 head-text">
                <span className="text-teal-800 text-6xl">{course.title}</span>
              </div>
              {course.imageUrl && (
                <div className="flex justify-content-center">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    width="550"
                    preview
                  />
                </div>
              )}
              <ScrollPanel>
                <p>Description: {course.description}</p>
              </ScrollPanel>

              {enrolled ? (
                <div className="flex justify-content-center">
                  <div className="flex flex-column">
                    <Button label="Enrolled" disabled className="w-30rem" />
                    <a
                      href={`/course/${course.docId}/lessons/1`}
                      className="font-bold flex justify-content-center mt-1"
                    >
                      Start taking the classes
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex justify-content-center">
                  <Button
                    label="Enroll"
                    onClick={handleEnroll}
                    className="w-30rem"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
