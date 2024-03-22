import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Panel } from "primereact/panel";
import { Card } from "primereact/card";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebase";
import { addDoc, collection, doc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateLessons.css";

const CreateLesson = () => {
  const { courseId, numberOfClasses } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState(
    Array.from({ length: parseInt(numberOfClasses) }, () => ({
      title: "",
      description: "",
      imageUrl: null,
    }))
  );

  const uploadFile = (file, index) => {
    if (!file) return;
    const imageRef = ref(storage, `images/${file.name}`);
    uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setLessons((prevLessons) => {
          const updatedLessons = [...prevLessons];
          updatedLessons[index].imageUrl = url;
          return updatedLessons;
        });
      });
    });
  };

  const handleCreateLesson = async () => {
    try {
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const val = doc(db, "courses", "lessons");
        const collectionValue = collection(val, `lesson${i + 1}`);
        addDoc(collectionValue, {
          title: lesson.title,
          description: lesson.description,
          imageUrl: lesson.imageUrl,
        });
        // const lessonRef = await db.collection("lessons").add();

        // const lessonId = lessonRef.id;

        // const courseRef = db.collection("courses").doc(courseId);
        // try {
        //   await courseRef.update({
        //     lessons: db.FieldValue.arrayUnion(db.doc(`lessons/${lessonId}`)),
        //   });
        // } catch (updateError) {
        //   console.error("Error updating course:", updateError);
        // }
      }

      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  return (
    <div>
      <h2>Create New Lessons</h2>
      {lessons.map((lesson, index) => (
        <Panel key={index} header={`Lesson Form ${index + 1}`}>
          <Card className="mt-3">
            <div key={index} className="lesson-form">
              <div>
                <label htmlFor={`lessonTitle${index}`}>Lesson Title:</label>
                <InputText
                  id={`lessonTitle${index}`}
                  value={lesson.title}
                  onChange={(e) => {
                    const updatedLessons = [...lessons];
                    updatedLessons[index].title = e.target.value;
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
              <div>
                <label htmlFor={`lessonImage${index}`}>Upload Image:</label>
                <FileUpload
                  id={`lessonImage${index}`}
                  name={`lessonImage${index}`}
                  chooseLabel="Choose"
                  uploadLabel="Upload"
                  cancelLabel="Cancel"
                  onSelect={(e) => uploadFile(e.files[0], index)}
                  accept="image/*"
                  maxFileSize={10000000}
                />
              </div>
            </div>
          </Card>
        </Panel>
      ))}
      <div>
        <Button
          type="button"
          label="Create Lessons"
          onClick={handleCreateLesson}
        />
      </div>
    </div>
  );
};

export default CreateLesson;
