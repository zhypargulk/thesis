import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import MenubarCustom from "./Menubar";
import { db, auth, storage } from "../config/firebase";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../controller/Courses"; // Import CSS file
import { doc } from "firebase/firestore";
import "./CreateCourse.css";

const CreateCourse = () => {
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newNumberOfClasses, setNewNumberOfClasses] = useState(0);
  const [arrayForClasses, setArrayForClasses] = useState([]);
  const [imageCourse, setImageCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const array = Array.from(
      { length: newNumberOfClasses },
      (_, index) => index
    );

    setLessons(
      Array.from({ length: newNumberOfClasses }, () => ({
        title: "",
        description: "",
        imageUrl: null,
      }))
    );
    setArrayForClasses(array);
  }, [newNumberOfClasses]);

  const handleCreateCourse = async () => {
    try {
      for (let i = 0; i < lessons.length; i++) {
        const imageRef = ref(
          storage,
          `videos/${lessons[i].videoURL.name + v4()}`
        );
        await uploadBytes(imageRef, lessons[i]);

        const videoURL = await getDownloadURL(imageRef);
        lessons[i].videoURL = videoURL;
      }

      const obj = {
        title: newCourseTitle,
        description: newCourseDescription,
        finalProject: newTaskDescription,
        numberOfClasses: newNumberOfClasses,
        answer: newAnswer,
        courseId: v4(),
        user: doc(db, "user/" + auth?.currentUser?.uid),
        students: [],
      };
      createCourse(imageCourse, obj, lessons);
      setNewCourseTitle("");
      setNewAnswer("");
      setNewTaskDescription("");
      setNewCourseDescription("");
      setNewNumberOfClasses(0);
      navigate("/courses");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <MenubarCustom />
      <h2>Create New Course</h2>
      <Card>
        <Panel header="Course Information">
          <div className="p-fluid p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-4 mt-4">
              <label htmlFor="title">
                Title: <sup>*</sup>
              </label>
              <InputText
                id="title"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
              />
            </div>
            <div className="p-field p-col-12 p-md-4">
              <label htmlFor="courseImage">
                Course Image: <sup>*</sup>
              </label>
              <input
                className="flex"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setImageCourse(event.target.files[0]);
                }}
              />
            </div>
            <div className="p-field p-col-12 p-md-8 mt-4">
              <label htmlFor="description">
                Description: <sup>*</sup>
              </label>
              <InputTextarea
                id="description"
                value={newCourseDescription}
                onChange={(e) => setNewCourseDescription(e.target.value)}
                rows={5}
                cols={30}
              />
            </div>
            <div className="p-field p-col-12 p-md-4 mt-4">
              <label htmlFor="numberOfClasses">
                Number of Classes: <sup>*</sup>
              </label>
              <InputNumber
                id="numberOfClasses"
                value={newNumberOfClasses}
                onValueChange={(e) => setNewNumberOfClasses(parseInt(e.value))}
                showButtons
                min={0}
                max={20}
              />
              <small style={{ color: "blue" }} className="mb-4">
                Maximum number of classes allowed is 20.
              </small>
            </div>
            <div className="p-field p-col-12 p-md-8 mt-4">
              <label htmlFor="description">
                Final project task description: <sup>*</sup>
              </label>
              <InputTextarea
                id="description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={5}
                cols={30}
              />
            </div>
            <div className="p-field p-col-12 p-md-8 mt-4">
              <label htmlFor="description">
                Answer for final project: <sup>*</sup>
              </label>
              <InputTextarea
                id="description"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={5}
                cols={30}
              />
            </div>
          </div>
        </Panel>
      </Card>
      <div>
        <h2>Create New Lessons</h2>
        {arrayForClasses.map((lesson, index) => (
          <Panel key={index} header={`Lesson Form ${index + 1}`}>
            <Card className="mt-3">
              <div key={index} className="lesson-form">
                <div>
                  <label htmlFor={`lessonTitle${index}`}>Lesson Title:</label>
                  <InputText
                    id={`lessonTitle${index}`}
                    value={lesson.title}
                    onChange={(event) => {
                      const updatedLessons = [...lessons];
                      updatedLessons[index].title = event.target.value;
                      setLessons(updatedLessons);
                    }}
                  />
                </div>
                <div>
                  <label htmlFor={`lessonDescription${index}`}>
                    Lesson Description:
                  </label>
                  <InputTextarea
                    id={`lessonDescription${index}`}
                    value={lesson.description}
                    onChange={(e) => {
                      const updatedLessons = [...lessons];
                      updatedLessons[index].description = e.target.value;
                      setLessons(updatedLessons);
                    }}
                    rows={5}
                    cols={30}
                  />
                </div>
                <div className="p-field p-col-12 p-md-4">
                  <label htmlFor="courseImage">
                    Course Image: <sup>*</sup>
                  </label>
                  <input
                    className="flex"
                    type="file"
                    accept="video/*,image/*"
                    onChange={(e) => {
                      const updatedLessons = [...lessons];
                      updatedLessons[index].videoURL = e.target.files[0];
                      setLessons(updatedLessons);
                    }}
                  />
                </div>
              </div>
            </Card>
          </Panel>
        ))}
      </div>
      <div className="p-mt-2 m-3">
        <Button
          type="button"
          label="Create Course"
          onClick={handleCreateCourse}
        />
      </div>
    </div>
  );
};

export default CreateCourse;
