import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { ScrollPanel } from "primereact/scrollpanel";
import { Accordion, AccordionTab } from "primereact/accordion";

import { auth } from "../../config/firebase";
import {
  checkUserEnrollment,
  enrollUserInCourse,
  getDocumentById,
  fetchLessonsByReferences,
} from "../../controller/Courses";
import MenubarCustom from "../menu/Menubar";
import "./CourseDetails.css";

const CourseDetails = () => {
  const [enrolled, setEnrolled] = useState(false);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState(null);
  const { docId } = useParams();

  useEffect(() => {
    const fetchCourseAndCheckEnrollment = async () => {
      try {
        const selectedCourse = await getDocumentById("courses", docId);
        if (selectedCourse) {
          const selectedLessons = await fetchLessonsByReferences(
            selectedCourse.lessons
          );
          setCourse(selectedCourse);
          setLessons(selectedLessons);

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
  };

  return (
    <>
      <MenubarCustom />
      <div className="p-grid2">
        <div className="sidebar" style={{ width: "30%" }}>
          {course && (
            <div className="course-sidebar">
              <h1 className="h1-custom">About course</h1>
              <p className="course-description">{course.description}</p>
              <h1 className="h1-custom">Course content</h1>
              <Accordion multiple>
                {lessons.map((lesson, index) => (
                  <AccordionTab
                    header={lesson.title}
                    key={index}
                    headerClassName="bg-danger"
                  >
                    <p className="m-0">{lesson.description}</p>
                  </AccordionTab>
                ))}
              </Accordion>
            </div>
          )}
        </div>
        <div className="course-details" style={{ width: "70%" }}>
          <div className="course-title">
            <h1 className="h1-title">{course ? course.title : "Loading..."}</h1>
            <span className="span-text">
              You can find the course details here.
            </span>
          </div>
          {course && (
            <>
              <div className="course-image-container">
                <img
                width={700}
                height={600}
                  src={course.imageUrl}
                  alt={course.title}
                  className="course-image"
                />
              </div>
              <ScrollPanel className="">
                {enrolled ? (
                  <>
                    <Button label="Enrolled" disabled className="mt-2 w-full" />
                    <a
                      href={`/course/${course.docId}/lessons/1`}
                      className="w-full text-white link-custom"
                    >
                      Start learning
                    </a>
                  </>
                ) : (
                  <Button
                    label="Enroll"
                    onClick={handleEnroll}
                    className="mt-2 w-full"
                  />
                )}
              </ScrollPanel>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
