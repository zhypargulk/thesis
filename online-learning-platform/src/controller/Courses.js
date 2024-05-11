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
import { auth, db, storage } from "../config/firebase";

export const createCourse = async (imageCourse, courseObject, lessons) => {
  try {
    const imageRef = ref(storage, `images/${imageCourse.name}-${v4()}`);
    await uploadBytes(imageRef, imageCourse);
    const imageUrl = await getDownloadURL(imageRef);

    courseObject.imageUrl = imageUrl;

    const courseDocRef = await addDoc(collection(db, "courses"), courseObject);
    await updateDoc(courseDocRef, {
      docId: courseDocRef.id,
    });

    const lessonsCollectionRef = collection(db, "lessons");
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];

      const lessonRef = await addDoc(lessonsCollectionRef, {
        title: lesson.title,
        description: lesson.description,
        videoURL: lesson.videoURL,
        lessonNumber: i + 1,
        docId: courseDocRef.id,
        course: courseDocRef,
      });

      await updateDoc(courseDocRef, {
        lessons: arrayUnion(lessonRef),
      });

      await updateDoc(lessonRef, {
        lessonId: lessonRef.id,
      });
    }
  } catch (error) {
    console.error(
      "An error occurred while creating the course and lessons:",
      error
    );
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

export const fetchMyCourses = async () => {
  try {
    const userRef = doc(db, "user", auth.currentUser.uid); // Creating a reference to the user's document
    const courseCollectionRef = collection(db, "courses");

    // Create a query against the collection.
    const q = query(
      courseCollectionRef,
      where("students", "array-contains", userRef)
    );

    const querySnapshot = await getDocs(q);
    const fetchedCourses = [];
    querySnapshot.forEach((doc) => {
      let course = doc.data();
      course.id = doc.id; // Add document ID to the course data
      fetchedCourses.push(course);
    });

    return fetchedCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
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
      const isEnrolled = enrollments.some((item) => item.id === docId);
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
    const userDocRef = doc(db, "user", uid);
    await updateDoc(courseDocRef, {
      students: arrayUnion(userDocRef),
    });

    await updateDoc(userDocRef, {
      enrollments: arrayUnion(courseDocRef),
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

export const fetchLessonsByReferences = async (lessonsRef) => {
  const lessons = [];

  for (const lessonRef of lessonsRef) {
    try {
      const lessonSnapshot = await getDoc(lessonRef);
      if (lessonSnapshot.exists()) {
        lessons.push({
          id: lessonSnapshot.id,
          ...lessonSnapshot.data(),
        });
      } else {
        console.log("No data found for:", lessonRef.id);
      }
    } catch (error) {
      console.error("Error fetching lesson data:", error);
    }
  }

  const sortedLessons = lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
  return sortedLessons;
};

export const markLessonAsDone = async (lessonId, uid) => {
  const userRef = doc(db, "user", uid);
  const lessonRef = doc(db, "lessons", lessonId);

  try {
    await updateDoc(lessonRef, {
      students: arrayUnion(userRef),
    });
  } catch (error) {
    console.error("Error marking lesson as done:", error);
  }
};

export const fetchAllLessonsWithCompletionStatus = async (courseId, userId) => {
  const lessonsRef = collection(db, "lessons");
  const courseRef = doc(db, "courses", courseId);
  const userRef = doc(db, "user", userId);

  const q = query(lessonsRef, where("course", "==", courseRef));

  try {
    const querySnapshot = await getDocs(q);
    const lessons = [];

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();

      let checked = false;
      if (data.students) {
        for (const studentRef of data.students) {
          const studentDoc = await getDoc(studentRef);
          if (studentDoc.id === userRef.id) {
            checked = true;
            break;
          }
        }
      }

      lessons.push({
        id: docSnapshot.id,
        ...data,
        checked: checked,
      });
    }

    const sortedLessons = lessons.sort(
      (a, b) => a.lessonNumber - b.lessonNumber
    );
    return sortedLessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
};

export const fetchLastCompletedLesson = async (courseId, userId) => {
  const lessonsRef = collection(db, "lessons");
  const courseRef = doc(db, "courses", courseId);
  const userRef = doc(db, "user", userId);

  const q = query(lessonsRef, where("course", "==", courseRef));

  try {
    const querySnapshot = await getDocs(q);
    const lessons = [];

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();

      let checked = false;
      if (data.students) {
        for (const studentRef of data.students) {
          const studentDoc = await getDoc(studentRef);
          if (studentDoc.id === userRef.id) {
            checked = true;
            break;
          }
        }
      }

      lessons.push({
        id: docSnapshot.id,
        ...data,
        checked: checked,
      });
    }

    const sortedLessons = lessons.sort(
      (a, b) => a.lessonNumber - b.lessonNumber
    );

    const firstIncompleteLessonIndex = sortedLessons.findIndex(
      (lesson) => !lesson.checked
    );

    if (firstIncompleteLessonIndex === -1) {
      return lessons.length;
    }

    return firstIncompleteLessonIndex + 1;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
};

export const fetchMyCreatedCourses = async (userId) => {
  try {
    const coursesCollection = collection(db, "courses");
    const userDocRef = doc(db, "user", userId);
    const q = query(coursesCollection, where("user", "==", userDocRef));
    const querySnapshot = await getDocs(q);
    const courses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(courses);
    return courses;
  } catch (error) {
    console.error("Failed to fetch courses: ", error);
  }
};
