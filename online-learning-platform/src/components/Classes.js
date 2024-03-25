import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Lesson from "./Lesson";
import { fetchCourses, fetchLessonsByCourseId } from "../controller/Courses";

const Classes = () => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState();
  const [lesson, setLesson] = useState();
  const [array, setArray] = useState([]);
  const { courseId, lessonNumber } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCourses();
        setCourses(response);
        const selectedCourse = response.find(
          (course) => course.courseId === courseId
        );
        setCourse(selectedCourse);
        if (selectedCourse) {
          setArray(
            Array.from(
              { length: course?.numberOfClasses },
              (_, index) => index + 1
            )
          );
          console.log(fetchLessonsByCourseId(courseId));
          const lessonsResponse = await fetchLessonsByCourseId(courseId);
          setLesson(lessonsResponse);

          console.log(lessonsResponse);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchData();
  }, [courseId]);

  return <div></div>;
};

export default Classes;
