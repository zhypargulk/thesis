import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getAllEnrolledStudents = async (courseId) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnapshot = await getDoc(courseRef);

    const courseData = courseSnapshot.data();

    const studentIds = courseData.students;

    const enrolledStudents = [];

    for (const studentId of studentIds) {
      const userSnapshot = await getDoc(studentId);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        enrolledStudents.push(userData);
      }
    }

    return enrolledStudents;
  } catch (error) {
    return [];
  }
};
