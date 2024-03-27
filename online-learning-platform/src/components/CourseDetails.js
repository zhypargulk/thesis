import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { fetchCourseById } from "../controller/Courses";

const CourseDetails = () => {
  const [enrolled, setEnrolled] = useState(false);
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const selectedCourse = await fetchCourseById(courseId);

        if (selectedCourse) {
          setCourse(selectedCourse);
          console.log(course.lessons);
          if (auth.currentUser) {
            setEnrolled(selectedCourse.students.includes(auth.currentUser.uid));
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [courseId, auth.currentUser]);

  const handleEnroll = async () => {
    try {
      if (!auth.currentUser) {
        console.error("Error: Current user is undefined");
        return;
      }

      const uid = auth.currentUser.uid;
      const courseDocRef = doc(db, "courses", course.docId);
      await updateDoc(courseDocRef, {
        students: arrayUnion(uid),
      });

      // Update user's enrollments
      const userDocRef = doc(db, "user", uid);
      await updateDoc(userDocRef, {
        enrollments: arrayUnion(courseDocRef),
      });
      setEnrolled(true);
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
