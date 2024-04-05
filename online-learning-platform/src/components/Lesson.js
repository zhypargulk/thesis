import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { fetchLesson, getDocumentById } from "../controller/Courses";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import MenubarCustom from "./Menubar";
import { ScrollPanel } from "primereact/scrollpanel";

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
      <h2 className="text-orange-500 font-bold border border-black text-center text-5xl">
        {lesson.title}
      </h2>
      <div className="flex justify-content-center">
        <video
          id="myVideo"
          src={lesson.videoURL}
          type="video/mp4"
          style={{ width: "600px", height: "400px" }}
          controls
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className=" flex justify-content-center mt-4 mb-5">
        <ScrollPanel>
          <p>{lesson.description}</p>
        </ScrollPanel>
      </div>

      {showButton ? (
        <Button
          label="Next lesson"
          className="flex w-full"
          onClick={onClickHandler}
        />
      ) : (
        <Button
          label="Go to Project"
          className="flex w-full"
          onClick={onClickToProject}
        />
      )}
    </div>
  );
};

export default Lesson;
