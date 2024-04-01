import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { fetchLesson, getDocumentById } from "../controller/Courses";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import MenubarCustom from "./Menubar";

const Lesson = () => {
  const { docId, lessonNumber } = useParams();
  const [lesson, setLesson] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();
  const [length, setLength] = useState();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const courseData = await getDocumentById("courses", docId);
        setLength(courseData.lessons.length);

        if (length === 1) {
          setLesson(courseData.lessons[0]);
        } else {
          const lessonData = await fetchLesson(courseData, lessonNumber);
          setLesson(lessonData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLessons();
  }, [docId, lessonNumber, length]);

  useEffect(() => {
    if (Number(lessonNumber) !== length) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [lessonNumber, length]);

  if (!lesson) {
    return <div>Loading lesson...</div>;
  }

  const onClickHandler = () => {
    navigate(`/course/${docId}/lessons/${Number(lessonNumber) + 1}`);
  };

  const onClickToProject = () => {
    navigate(`/course/${docId}/task`);
  };

  return (
    <div>
      <MenubarCustom />
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
