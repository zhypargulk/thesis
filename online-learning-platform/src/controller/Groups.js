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

export const createGroupWithModifications = async (
  docId,
  selectedStudents,
  studentsIds,
  userId
) => {
  try {
    const groupCollectionRef = collection(db, "groups");
    const courseDocRef = doc(db, "courses", docId);

    const updatedSelectedStudents = selectedStudents.map((student) => ({
      ...student,
    }));

    const myData = await fetchUserData(auth.currentUser.uid);

    const MyDataObject = {
      email: myData.email,
      id: myData.id,
      name: myData.name,
    };

    const newArray = [...updatedSelectedStudents, { ...MyDataObject }];

    const groupData = {
      courseDocId: docId,
      students: newArray,
      studentIds: [...studentsIds, ...[userId]],
    };

    const groupRef = await addDoc(groupCollectionRef, groupData);
    const courseDocSnapshot = await getDoc(courseDocRef);

    await updateDoc(groupRef, { groupId: groupRef.id });
    if (courseDocSnapshot.exists()) {
      await updateDoc(courseDocRef, {
        groups: arrayUnion(groupRef.id),
      });
    } else {
      await setDoc(courseDocRef, { groups: [groupRef.id] });
    }

    const updateUserPromises = newArray.map(async (student) => {
      const userDocRef = doc(db, "user", student.id);

      await updateDoc(userDocRef, {
        groupDocID: arrayUnion(groupRef.id),
      });
    });

    await Promise.all(updateUserPromises);
  } catch (error) {
    console.error("Error creating group: ", error);
  }
};

export const getGroupsByUserId = async (userId) => {
  try {
    const groupsCollectionRef = collection(db, "groups");
    const q = query(
      groupsCollectionRef,
      where("students", "array-contains", userId)
    );
    const querySnapshot = await getDocs(q);

    const groups = [];
    querySnapshot.forEach((doc) => {
      groups.push({ id: doc.id, ...doc.data() });
    });

    return groups;
  } catch (error) {
    console.error("Error fetching groups:", error);
  }
};

export const getCoursesByUserId = async (studentId) => {
  try {
    const groupsQuery = query(
      collection(db, "groups"),
      where("studentIds", "array-contains", studentId)
    );
    const groupsQuerySnapshot = await getDocs(groupsQuery);

    const courseIds = [];

    groupsQuerySnapshot.forEach((doc) => {
      const { courseDocId } = doc.data();
      console.log(courseDocId);
      courseIds.push(courseDocId);
    });

    return courseIds;
  } catch (error) {
    console.error("Error fetching course IDs:", error);
  }
};

export const getGroupByUserIdAndCourseId = async (userId, courseId) => {
  try {
    // Query for groups where the provided userId is in the students array and courseId matches
    const groupsQuery = query(
      collection(db, "groups"),
      where("studentIds", "array-contains", userId)
    );

    const groupsQuerySnapshot = await getDocs(groupsQuery);

    // Check if any matching group document exists
    if (!groupsQuerySnapshot.empty) {
      // Assuming there's only one matching group, return the first one found
      const groupDoc = groupsQuerySnapshot.docs[0];
      return { id: groupDoc.id, ...groupDoc.data() };
    } else {
      // No matching group found
      return null;
    }
  } catch (error) {
    console.error("Error fetching group:", error);
    throw error; // Rethrow the error for handling it outside the function if needed
  }
};

export const getStudentsByGroupId = async (groupId) => {
  try {
    const groupDocRef = doc(db, "groups", groupId);
    const groupDocSnapshot = await getDoc(groupDocRef);

    if (groupDocSnapshot.exists()) {
      const groupData = groupDocSnapshot.data();
      const { studentIds } = groupData;

      const users = [];

      for (const studentId of studentIds) {
        const userDocRef = doc(db, "user", studentId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const { name } = userData;
          users.push({ id: studentId, name });
        }
      }

      return users;
    } else {
      console.error("Group document not found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching students by group ID:", error);
    throw error;
  }
};

export const addLeaderToGroup = async (groupId, userId) => {
  try {
    const groupDocRef = doc(db, "groups", groupId);
    await updateDoc(groupDocRef, {
      leaderGroup: userId,
    });
    console.log("Leader added to group:", userId);
  } catch (error) {
    console.error("Error adding leader to group:", error);
    throw error;
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
