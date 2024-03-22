import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import MenubarCustom from "./Menubar";
import { db, auth, storage } from "../config/firebase";
import { v4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./CreateCourse.css";
import { createCourse } from "../controller/Courses"; // Import CSS file

import {
  doc,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const CreateCourse = () => {
  // Course fields
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newNumberOfClasses, setNewNumberOfClasses] = useState(0);
  const [arrayForClasses, setArrayForClasses] = useState([]);
  const [imageCourse, setImageCourse] = useState(null);
  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");
  const userListRef = collection(db, "user");

  // db

  useEffect(() => {
    const array = Array.from(
      { length: newNumberOfClasses },
      (_, index) => index
    );
    setArrayForClasses(array);
  }, [newNumberOfClasses]);

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  const handleCreateCourse = async () => {
    try {
      const imageRef = ref(storage, `images/${imageCourse.name + v4()}`);

      const obj = {
        title: newCourseTitle,
        description: newCourseDescription,
        finalProject: newTaskDescription,
        numberOfClasses: newNumberOfClasses,
        answer: newAnswer,
        courseId: v4(),
        user: doc(db, "user/" + auth?.currentUser?.uid),
      };
      createCourse(imageCourse, obj);
      setNewCourseTitle("");
      setNewAnswer("");
      setNewTaskDescription("");
      setNewCourseDescription("");
      setNewNumberOfClasses(0);

      navigate(`/create-course/${obj.courseId}/${obj.numberOfClasses}`);
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
