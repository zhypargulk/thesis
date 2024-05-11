import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  where,
  setDoc,
  arrayUnion,
  query,
} from "firebase/firestore";
import { fetchUserData } from "../controller/User";

export const createGroupWithModifications = async (docId, selectedStudents) => {
  try {
    const groupCollectionRef = collection(db, "groups");
    const courseDocRef = doc(db, "courses", docId);

    const myData = await fetchUserData(auth.currentUser.uid);

    const updatedSelectedStudents = selectedStudents.map((student) =>
      doc(db, "user", student.id)
    );

    updatedSelectedStudents.push(doc(db, "user", myData.id));

    const groupData = {
      courseDocRef,
      students: updatedSelectedStudents,
    };

    const groupRef = await addDoc(groupCollectionRef, groupData);

    const courseDocSnapshot = await getDoc(courseDocRef);
    if (courseDocSnapshot.exists()) {
      await updateDoc(courseDocRef, {
        groups: arrayUnion(groupRef),
      });
    } else {
      await setDoc(courseDocRef, { groups: [groupRef] });
    }

    const updateUserPromises = updatedSelectedStudents.map((studentRef) =>
      updateDoc(studentRef, {
        groupDocID: arrayUnion(groupRef),
      })
    );

    await Promise.all(updateUserPromises);
  } catch (error) {
    console.error("Error creating group: ", error);
  }
};

export const fetchStudentCoursesAndGroups = async (userId) => {
  try {
    const userDocRef = doc(db, "user", userId);
    const groupCollectionRef = collection(db, "groups");
    const groupsQuery = query(
      groupCollectionRef,
      where("students", "array-contains", userDocRef)
    );
    const querySnapshot = await getDocs(groupsQuery);

    const coursesAndGroups = [];

    for (const groupDoc of querySnapshot.docs) {
      const groupData = groupDoc.data();
      const courseDocRef = groupData.courseDocRef;
      const courseDocSnapshot = await getDoc(courseDocRef);

      let courseData;
      if (courseDocSnapshot.exists()) {
        courseData = courseDocSnapshot.data();
      }

      coursesAndGroups.push({
        groupId: String(groupDoc.id),
        courseId: courseDocRef.id,
        title: courseData.title,
        imageUrl: courseData.imageUrl,
      });
    }

    return coursesAndGroups;
  } catch (error) {
    console.error("Error fetching courses and groups for the student: ", error);
    return [];
  }
};

export const addLeaderToGroup = async (groupId, userId) => {
  try {
    const userDocRef = doc(db, "user", userId);
    const groupDocRef = doc(db, "groups", groupId);
    await updateDoc(groupDocRef, {
      leaderGroup: userDocRef,
    });
    console.log("Leader added to group:", userId);
  } catch (error) {
    console.error("Error adding leader to group:", error);
  }
};

export const updateGroupAnswer = async (groupId, newStatus) => {
  try {
    const groupDocRef = doc(db, "groups", groupId);
    await updateDoc(groupDocRef, {
      success: newStatus,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

export const fetchStudentsInGroup = async (groupId) => {
  try {
    const groupDocRef = doc(db, "groups", groupId);
    const groupDocSnapshot = await getDoc(groupDocRef);

    if (!groupDocSnapshot.exists()) {
      console.log("No such group exists!");
      return [];
    }

    const groupData = groupDocSnapshot.data();
    const studentRefs = groupData.students;

    const studentDataPromises = studentRefs.map((studentRef) =>
      getDoc(studentRef)
    );
    const studentDocs = await Promise.all(studentDataPromises);
    const students = studentDocs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return students;
  } catch (error) {
    console.error("Error fetching students in the group: ", error);
  }
};

export const getCourseByRef = async (ref) => {
  try {
    const docSnapshot = await getDoc(ref);

    return docSnapshot.data();
  } catch (error) {
    console.error("Error retrieving course data:", error);
  }
};

export const getLeaderByRef = async (ref) => {
  try {
    const docSnapshot = await getDoc(ref);

    return docSnapshot.data();
  } catch (error) {
    console.error("Error retrieving leader data:", error);
  }
};

export const getCourseByGroupId = async (id) => {
  try {
    const groupDocRef = doc(db, "groups", id);

    const groupDocSnapshot = await getDoc(groupDocRef);

    if (!groupDocSnapshot.exists()) {
      console.error("Group document does not exist.");
    }

    const groupData = groupDocSnapshot.data();

    if (!groupData.courseDocRef) {
      console.error("Course document reference not found in group data.");
      return null;
    }

    const courseData = await getCourseByRef(groupData.courseDocRef);
    return courseData;
  } catch (error) {
    console.error("Error retrieving course data:", error);
  }
};
