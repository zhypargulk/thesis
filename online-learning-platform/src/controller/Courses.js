import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getFirestore,
} from "firebase/firestore";
import { db, auth, storage } from "../config/firebase";

const courseCollectionRef = collection(db, "courses");

export const createCourse = async (imageCourse, object, lessons) => {
  try {
    const imageRef = ref(storage, `images/${imageCourse.name + v4()}`);
    await uploadBytes(imageRef, imageCourse);

    const imageUrl = await getDownloadURL(imageRef);
    object.imageUrl = imageUrl;
    const courseDocRef = await addDoc(courseCollectionRef, object);

    const lessonCollectionRef = collection(courseDocRef, "lessons");
    console.log(lessons);

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const lessonId = v4();
      await addDoc(lessonCollectionRef, {
        id: lessonId,
        title: lesson.title,
        description: lesson.description,
        videoURL: lesson.videoURL,
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

export const fetchCourses = async () => {
  try {
    const courseCollectionRef = collection(db, "courses");
    const querySnapshot = await getDocs(courseCollectionRef);
    const fetchedCourses = [];
    querySnapshot.forEach((doc) => {
      const course = doc.data();
      fetchedCourses.push(course);
    });
    return fetchedCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export const fetchLessonsByCourseId = async (courseId) => {
  try {
    const lessonsCollectionRef = collection(db, `courses/${courseId}/lessons`);

    const querySnapshot = await getDocs(lessonsCollectionRef);
    const lessons = [];
    querySnapshot.forEach((doc) => {
      const lesson = doc.data();
      lessons.push(lesson);
    });
    return lessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return []; // Return an empty array in case of error
  }
};
