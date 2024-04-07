import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  getDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";

const courseCollectionRef = collection(db, "courses");

export const createCourse = async (imageCourse, object, lessons) => {
  try {
    const imageRef = ref(storage, `images/${imageCourse.name + v4()}`);
    await uploadBytes(imageRef, imageCourse);

    const imageUrl = await getDownloadURL(imageRef);
    object.imageUrl = imageUrl;
    const courseDocRef = await addDoc(courseCollectionRef, object);
    await updateDoc(courseDocRef, { docId: courseDocRef.id });

    // const lessonCollectionRef = collection(courseDocRef, "lessons");
    const lessonCollectionRef = collection(
      db,
      `courses/${courseDocRef.id}/lessons`
    );

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const lessonId = v4();
      await addDoc(lessonCollectionRef, {
        id: lessonId,
        title: lesson.title,
        description: lesson.description,
        videoURL: lesson.videoURL,
        lessonNumber: i + 1,
      });
    }

    const lessonsQuerySnapshot = await getDocs(lessonCollectionRef);
    const lessonsData = lessonsQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    await updateDoc(courseDocRef, { lessons: lessonsData });
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

export const fetchCourseById = async (docId) => {
  try {
    const courseDocRef = doc(db, "courses", docId);
    const docSnap = await getDoc(courseDocRef);

    if (docSnap.exists()) {
      const selectedCourse = { ...docSnap.data(), docId: docSnap.id };
      return selectedCourse;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

export const fetchLesson = async (course, lessonNumber) => {
  const lessonCollectionRef = collection(db, `courses/${course.docId}/lessons`);
  const lessonQuery = query(
    lessonCollectionRef,
    where("lessonNumber", "==", parseInt(lessonNumber))
  );
  const querySnapshot = await getDocs(lessonQuery);

  const lessonDoc = querySnapshot.docs[0];
  const lessonData = lessonDoc.data();
  return lessonData;
};

export const checkUserEnrollment = async (uid, docId) => {
  try {
    const userDocRef = doc(db, "user", uid);
    const userSnapshot = await getDoc(userDocRef);
    if (true) {
      const enrollments = userSnapshot.data().enrollments || [];
      const isEnrolled = enrollments.includes(docId);
      return isEnrolled;
    }
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return false;
  }
};

export const enrollUserInCourse = async (uid, courseDocId) => {
  try {
    const courseDocRef = doc(db, "courses", courseDocId);
    await updateDoc(courseDocRef, {
      students: arrayUnion(uid),
    });

    const userDocRef = doc(db, "user", uid);
    await updateDoc(userDocRef, {
      enrollments: arrayUnion(courseDocId),
    });

    return true;
  } catch (error) {
    console.error("Error enrolling user in course:", error);
    return false;
  }
};

export const getDocumentById = async (collectionPath, documentId) => {
  try {
    const documentRef = doc(db, collectionPath, documentId);
    const documentSnapshot = await getDoc(documentRef);
    const documentData = documentSnapshot.data();
    return documentData;
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};
