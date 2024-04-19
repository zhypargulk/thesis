import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { fetchLesson, getDocumentById } from "../../controller/Courses";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import MenubarCustom from "../Menubar";
import { ScrollPanel } from "primereact/scrollpanel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import "./Lesson.css";
import "../course-details/CourseDetails.css";

const Lesson = () => {
  const { docId, lessonNumber } = useParams();
  const [lesson, setLesson] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();
  const [length, setLength] = useState();
  const [course, setCourse] = useState();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const courseData = await getDocumentById("courses", docId);
        setLength(courseData.lessons.length);
        setCourse(courseData);

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
      <div className="p-grid2">
        <div className="sidebar" style={{ width: "30%" }}>
          {course && (
            <div className="course-sidebar">
              <h1 className="h1-custom">{course.title}</h1>

              <h2 className="h2-custom">Course content</h2>

              <DataTable
                value={course.lessons}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column field="title" header="List of lessons"></Column>
              </DataTable>
            </div>
          )}
        </div>
        <div className="course-details" style={{ width: "70%" }}>
          <div className="course-title">
            <h1 className="h1-title">{course ? lesson.title : "Loading..."}</h1>
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

          <div className=" flex justify-content-center mt-4 mb-5">
            <ScrollPanel className="description">
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
      </div>
    </div>
  );
};

export default Lesson;
