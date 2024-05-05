import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import MenubarCustom from "../menu/Menubar";
import { db, auth, storage } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../controller/Courses"; // Import CSS file
import { doc } from "firebase/firestore";
import { Toast } from "primereact/toast";

import "./CreateCourse.css";

const CreateCourse = () => {
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [imageCourse, setImageCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const user = useAuth();
  const toast = useRef(null);

  const handleCreateCourse = async () => {
    try {
      for (let i = 0; i < lessons.length; i++) {
        const imageRef = ref(
          storage,
          `videos/${lessons[i].videoURL.name + v4()}`
        );

        await uploadBytes(imageRef, lessons[i].videoURL);

        const videoURL = await getDownloadURL(imageRef);
        lessons[i].videoURL = videoURL;
      }

      const obj = {
        title: newCourseTitle,
        description: newCourseDescription,
        finalProject: newTaskDescription,
        numberOfClasses: lessons.length,
        answer: newAnswer,
        courseId: v4(),
        user: doc(db, "user/" + auth?.currentUser?.uid),
      };
      createCourse(imageCourse, obj, lessons);
      showSuccessCreatedCourse();
      setNewCourseTitle("");
      setNewAnswer("");
      setNewTaskDescription("");
      setNewCourseDescription("");
      setLessons([]);
    } catch (err) {
      console.error(err);
    }
  };

  const showSuccessCreatedCourse = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "New tasks were created",
      life: 3000,
    });
  };

  const isFormValid = () => {
    const mainFieldsFilled =
      newCourseTitle &&
      newCourseDescription &&
      newTaskDescription &&
      newAnswer &&
      imageCourse;
    const validNumberOfClasses = lessons.length > 0;
    const lessonsValid = lessons.every(
      (lesson) => lesson.title && lesson.description && lesson.videoURL
    );

    return mainFieldsFilled && validNumberOfClasses && lessonsValid;
  };

  const removeLesson = (index) => {
    const updatedLessons = lessons.filter((_, i) => i !== index);
    setLessons(updatedLessons);
  };

  const addNewLesson = () => {
    setLessons([
      ...lessons,
      { title: "", description: "", videoURL: null, teacher: user.uid },
    ]);
  };

  return (
    <>
      <MenubarCustom />
      <Toast ref={toast} />
      <div className="create-course-container">
        <div className="flex align-items-center justify-content-center mt-4 head-text">
          <span className="text-6xl course-color">Create New Course</span>
        </div>

        <div className="course-panel">
          <div className="p-formgrid p-grid">
            <div className="form-field p-col-12 p-md-4">
              <label htmlFor="title">
                Title: <sup>*</sup>
              </label>
              <InputText
                id="title"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
              />
            </div>
            <div className="form-field p-col-12 p-md-4">
              <label htmlFor="courseImage">
                Course Image: <sup>*</sup>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageCourse(event.target.files[0])}
              />
            </div>
            <div className="form-field p-col-12 p-md-8">
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
            <div className="form-field p-col-12 p-md-8">
              <label htmlFor="taskDescription">
                Final Project Task Description: <sup>*</sup>
              </label>
              <InputTextarea
                id="taskDescription"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows={5}
                cols={30}
              />
            </div>
            <div className="form-field p-col-12 p-md-8">
              <label htmlFor="answer">
                Answer for Final Project: <sup>*</sup>
              </label>
              <InputTextarea
                id="answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={5}
                cols={30}
              />
            </div>
          </div>
        </div>

        {lessons.map((lesson, index) => (
          <div key={index} className="lesson-panel">
            <div className="p-formgrid p-grid">
              <div className="form-field p-col-12 p-md-4">
                <label htmlFor={`lessonTitle${index}`}>
                  Lesson Title: <sup>*</sup>
                </label>
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
              <div className="form-field p-col-12 p-md-8">
                <label htmlFor={`lessonDescription${index}`}>
                  Lesson Description: <sup>*</sup>
                </label>
                <InputTextarea
                  id={`lessonDescription${index}`}
                  value={lesson.description}
                  onChange={(event) => {
                    const updatedLessons = [...lessons];
                    updatedLessons[index].description = event.target.value;
                    setLessons(updatedLessons);
                  }}
                  rows={5}
                  cols={30}
                />
              </div>
              <div className="form-field p-col-12 p-md-8">
                <label htmlFor={`lessonVideo${index}`}>
                  Lesson Video or Image: <sup>*</sup>
                </label>
                <input
                  type="file"
                  accept="video/*, image/*"
                  onChange={(event) => {
                    const updatedLessons = [...lessons];
                    updatedLessons[index].videoURL = event.target.files[0];
                    setLessons(updatedLessons);
                  }}
                />
              </div>
              <Button
                label="Delete the Lesson"
                className="button"
                onClick={() => removeLesson(index)}
              />
            </div>
          </div>
        ))}

        <Button
          label="Add New Lesson"
          className="button"
          onClick={addNewLesson}
        />
        <Button
          label="Create Course"
          className="button"
          onClick={handleCreateCourse}
          disabled={!isFormValid()}
        />
      </div>
    </>
  );
};

export default CreateCourse;
