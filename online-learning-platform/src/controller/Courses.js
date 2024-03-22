import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth, storage } from "../config/firebase";

const courseCollectionRef = collection(db, "courses");

export const createCourse = async (imageCourse, object) => {
  const imageRef = ref(storage, `images/${imageCourse.name + v4()}`);
  await uploadBytes(imageRef, imageCourse);

  const imageUrl = await getDownloadURL(imageRef);
  object.imageUrl = imageUrl;
  await addDoc(courseCollectionRef, object);
};

export const getCourses = async () => {
  await getDocs(courseCollectionRef);
};

//delete course
