import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  fetchCourseById,
  checkUserEnrollment,
  enrollUserInCourse,
} from "../controller/Courses";

const CourseDetails = () => {
  const [enrolled, setEnrolled] = useState(false);
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourseAndCheckEnrollment = async () => {
      try {
        const selectedCourse = await fetchCourseById(courseId);
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
  }, [courseId]);

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
    <div>
      <h2>Course Details</h2>
      <div className="p-grid p-fluid">
        <div className="p-col-12 p-md-6">
          <Card>
            {course && (
              <>
                <h3>{course.title}</h3>
                {course.imageUrl && (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                )}
                <p>Description: {course.description}</p>

                {enrolled ? (
                  <div>
                    <Button label="Enrolled" disabled />
                    <a
                      href={`/course/${course.courseId}/lessons/1`}
                      className="font-bold"
                    >
                      Start taking the classes
                    </a>
                  </div>
                ) : (
                  <Button label="Enroll" onClick={handleEnroll} />
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
