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
        console.log(userData);
        enrolledStudents.push(userData);
      }
    }

    console.log(enrolledStudents);
    return enrolledStudents;
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    return [];
  }
};

export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return {
        id: userId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      };
    } else {
      throw new Error("User document not found");
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};
