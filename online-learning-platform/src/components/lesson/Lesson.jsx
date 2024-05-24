import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  getDocumentById,
  fetchLessonsByReferences,
  markLessonAsDone,
  fetchAllLessonsWithCompletionStatus,
  parseContent,
} from "../../controller/Courses";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import MenubarCustom from "../menu/Menubar";
import { ScrollPanel } from "primereact/scrollpanel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useAuth } from "../../context/AuthContext";
import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";

import "./Lesson.css";
import "../course-details/CourseDetails.css";

const Lesson = () => {
  const { docId, lessonNumber } = useParams();
  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate() ;
  const [length, setLength] = useState();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const user = useAuth();

  const fetchLessons = async () => {
    try {
      const courseData = await getDocumentById("courses", docId);
      if (courseData && user && user.uid) {
        const selectedLessons = await fetchLessonsByReferences(
          courseData.lessons
        );
        console.log(selectedLessons);
        const lessonsWithStatus = await fetchAllLessonsWithCompletionStatus(
          docId,
          user.uid
        );
        console.log(lessonsWithStatus);

        setLessons(lessonsWithStatus);
        setLength(selectedLessons.length);
        setCourse(courseData);

        determineLessonToDisplay(selectedLessons, lessonNumber);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const determineLessonToDisplay = (lessonsArray, lessonNum) => {
    if (lessonsArray.length === 1) {
      setLesson(lessonsArray[0]);
    } else {
      setLesson(lessonsArray[lessonNum - 1]);
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      fetchLessons();
    }
  }, [docId, user, lessonNumber, refetchTrigger]);

  useEffect(() => {
    if (Number(lessonNumber) < length) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [lessonNumber, length]);

  const onClickHandler = () => {
    navigate(`/course/${docId}/lessons/${Number(lessonNumber) + 1}`);
  };

  const onClickToProject = () => {
    navigate(`/course/${docId}/task`);
  };

  const markAsCompleteLesson = async () => {
    if (user && user.uid) {
      markLessonAsDone(lesson.lessonId, user.uid);
      setRefetchTrigger(!refetchTrigger);
    }
  };

  const handleClickLesson = (item) => {
    navigate(`/course/${docId}/lessons/${item.lessonNumber}`);
  };
  const bodyCheckBox = (item) => <Checkbox checked={item.checked}></Checkbox>;

  const templateTitle = (item) => (
    <Button
      label={item.title}
      className="p-button-secondary bg-white text-indigo-900"
      onClick={() => handleClickLesson(item)}
    />
  );
  return (
    <>
      <MenubarCustom />
      <div className="p-grid2">
        {course && lesson && lessons ? (
          <>
            <div className="sidebar" style={{ width: "30%" }}>
              <div className="course-sidebar">
                <h1 className="h1-custom">{course.title}</h1>

                <h2 className="h2-custom">Course content</h2>

                <DataTable value={lessons} tableStyle={{ minWidth: "30rem" }}>
                  <Column
                    header="Completed"
                    body={bodyCheckBox}
                    field="checked"
                    className="w-1rem"
                  ></Column>
                  <Column
                    field="title"
                    header="List of lessons"
                    body={templateTitle}
                  ></Column>
                </DataTable>
              </div>
            </div>
            <div className="course-details" style={{ width: "70%" }}>
              <Button
                label="Mark the lesson as done"
                className="mt-2"
                onClick={() => markAsCompleteLesson()}
              />
              <div >
                <h3 className="h3-title">{lesson.title}</h3>
              </div>

              <div className="flex justify-content-center">
                <video
                  id="myVideo"
                  src={lesson.videoURL}
                  type="video/mp4"
                  style={{ width: "600px", height: "400px" }}
                  controls
                  className="custom-video-player"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="flex justify-content-center mt-4 mb-5">
                <ScrollPanel className="description w-full h-15rem">
                  <p>{parseContent(lesson.description)}</p>
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
          </>
        ) : (
          <div className="spinner-container">
            <ProgressSpinner />
          </div>
        )}
      </div>
    </>
  );
};

export default Lesson;
