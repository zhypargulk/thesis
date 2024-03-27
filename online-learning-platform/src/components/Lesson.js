import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { fetchCourseById, fetchLesson } from "../controller/Courses";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const Lesson = () => {
  const { courseId, lessonNumber } = useParams();
  const [lesson, setLesson] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();
  const [length, setLength] = useState();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const courseData = await fetchCourseById(courseId);
        const lessonData = await fetchLesson(courseData, lessonNumber);
        setLesson(lessonData);
        setLength(courseData.lessons.length);
        // if (lessonNumber !== courseData.lessons.length) {
        //   setShowButton(true);
        // }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLessons();
  }, [courseId, lessonNumber]);

  useEffect(() => {
    if (Number(lessonNumber) !== length) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [lessonNumber]);

  if (!lesson) {
    return <div>Loading lesson...</div>;
  }

  const onClickHandler = () => {
    navigate(`/course/${courseId}/lessons/${Number(lessonNumber) + 1}`);
  };

  const onClickToProject = () => {
    navigate("/");
  };

  console.log(lessonNumber);
  return (
    <div>
      <h2>{lesson.title}</h2>
      <p>{lesson.description}</p>
      <video controls>
        <source src={lesson.videoURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {showButton ? (
        <Button label="Next lesson" className="flex" onClick={onClickHandler} />
      ) : (
        <Button
          label="Go to Project"
          className="flex"
          onClick={onClickToProject}
        />
      )}
    </div>
  );
};

export default Lesson;
