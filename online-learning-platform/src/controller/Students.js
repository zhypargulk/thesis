import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getAllEnrolledStudents = async (courseId) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnapshot = await getDoc(courseRef);

    if (!courseSnapshot.exists()) {
      throw new Error("Course document not found");
    }

    const courseData = courseSnapshot.data();
    if (!courseData.students || !Array.isArray(courseData.students)) {
      throw new Error("Invalid or missing 'students' field in course document");
    }

    const studentIds = courseData.students;

    const enrolledStudents = [];

    for (const studentId of studentIds) {
      const userRef = doc(db, "user", studentId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        enrolledStudents.push({
          id: studentId,
          email: userData.email,
          name: userData.name,
        });
      }
    }

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
        role: userData.role, // Add any additional fields you need
      };
    } else {
      throw new Error("User document not found");
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};
