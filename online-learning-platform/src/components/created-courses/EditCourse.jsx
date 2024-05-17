import React, { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db, storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import MenubarCustom from "../menu/Menubar";
import { Toast } from "primereact/toast";

import "./EditCourse.css";

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      const docRef = doc(db, "courses", courseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const courseData = docSnap.data();
        setCourse(courseData);

        if (courseData.lessons && courseData.lessons.length > 0) {
          try {
            const lessonsFetches = courseData.lessons.map((lessonRef) =>
              getDoc(lessonRef)
            );
            const lessonsDocs = await Promise.all(lessonsFetches);
            const lessonsData = lessonsDocs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setLessons(lessonsData);
          } catch (error) {
            console.error("Error fetching lessons:", error);
          }
        }
      } 
      setIsLoading(false);
    };

    fetchCourse();
  }, [courseId, db]);

  const handleUpdateCourse = async () => {
    setIsLoading(true);

    const courseRef = doc(db, "courses", courseId);
    try {
      await updateDoc(courseRef, {
        title: course.title,
        description: course.description,
        finalProject: course.finalProject,
        answer: course.answer,
      });

      await Promise.all(
        lessons.map(async (lesson) => {
          const lessonRef = doc(db, "lessons", lesson.id);
          if (lesson.videoURL instanceof File) {
            const fileRef = ref(storage, `lessons/${lesson.id}`);
            await uploadBytes(fileRef, lesson.videoURL);
            lesson.videoURL = await getDownloadURL(fileRef);
          }
          await updateDoc(lessonRef, {
            title: lesson.title,
            description: lesson.description,
            videoURL: lesson.videoURL,
          });
        })
      );

      navigate("/createdcourses");
    } catch (error) {
      console.error("Error updating course or lessons: ", error);
    }
    setIsLoading(false);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: "", description: "", videoURL: null }]);
  };

  const updateLessonField = (index, field, value) => {
    const updatedLessons = [...lessons];
    updatedLessons[index][field] = value;
    setLessons(updatedLessons);
  };


  return (
    <>
      <MenubarCustom />
      <Toast ref={toast} />
      <div className="edit-course-container">
        <h2 className="edit-course-header">Edit Course</h2>
        <Panel header="Course Information" className="panel-custom">
         {course ? ( <><InputText
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
            className="input-text-custom"
            placeholder="Course Title"
          />
          <InputTextarea
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
            className="textarea-custom"
            rows={3}
            placeholder="Course Description"
          />
          <InputTextarea
            value={course.finalProject}
            onChange={(e) =>
              setCourse({ ...course, finalProject: e.target.value })
            }
            className="textarea-custom"
            rows={3}
            placeholder="Final Project Description"
          />
          <InputTextarea
            value={course.answer}
            onChange={(e) => setCourse({ ...course, answer: e.target.value })}
            className="textarea-custom"
            rows={3}
            placeholder="Answer for Final Project"
          />

          {lessons.map((lesson, index) => (
            <Card
              title={`Lesson ${index + 1}`}
              key={lesson.id}
              className="card-custom"
            >
              <InputText
                value={lesson.title}
                onChange={(e) =>
                  updateLessonField(index, "title", e.target.value)
                }
                className="input-text-custom"
                placeholder="Lesson Title"
              />
              <InputTextarea
                value={lesson.description}
                onChange={(e) =>
                  updateLessonField(index, "description", e.target.value)
                }
                className="textarea-custom"
                rows={2}
                placeholder="Lesson Description"
              />
              {lesson.videoURL && !lesson.newVideoURL && (
                <div>
                  <label>
                    Current Video:{" "}
                    <a
                      href={lesson.videoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      lesson
                    </a>
                  </label>
                </div>
              )}
              <br></br>
              Update file:
              <input
                type="file"
                onChange={(e) =>
                  updateLessonField(index, "videoURL", e.target.files[0])
                }
                className="input-file-custom"
              />
            </Card>
          ))}
          <Button
            label="Add Lesson"
            onClick={addLesson}
            className="button-custom"
          />
          <Button
            label="Update Course"
            onClick={handleUpdateCourse}
            className="button-custom"
          />
         </>) : <></>}
        </Panel>
      </div>
    </>
  );
};

export default EditCourse;
