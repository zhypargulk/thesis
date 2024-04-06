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
import { useAuth } from "../context/AuthContext";
import { useAuthenticatedUser } from "../components/Utils";

export const createGroup = async (docId, selectedStudents) => {
  try {
    const groupCollectionRef = collection(db, `courses/${docId}/groups`);

    const updatedSelectedStudents = selectedStudents.map((student) => ({
      ...student,
      acceptedInvitations: false, // Assuming initially all invitations are not accepted
    }));

    const myData = await fetchUserData();

    const newArray = [
      ...updatedSelectedStudents,
      ...[{ ...myData, acceptedInvitations: true }],
    ];
    const object = {
      students: newArray,
    };

    const groupRef = await addDoc(groupCollectionRef, object);
    const updatedObject = {
      ...object,
      docId: groupRef.id,
    };

    // Update the document in Firestore with the updated object
    await updateDoc(groupRef, { docId: groupRef.id });
  } catch (error) {
    console.error("Error creating group: ", error);
  }
};

export const createGroupWithModifications = async (docId, selectedStudents) => {
  try {
    const groupCollectionRef = collection(db, "groups");
    const courseDocRef = doc(db, "courses", docId);

    const updatedSelectedStudents = selectedStudents.map((student) => ({
      ...student,
      acceptedInvitations: false,
    }));

    const myData = await fetchUserData(auth.currentUser.uid);

    const newArray = [
      ...updatedSelectedStudents,
      { ...myData, acceptedInvitations: true },
    ];

    const groupData = {
      courseDocId: docId,
      students: newArray,
    };

    const groupRef = await addDoc(groupCollectionRef, groupData);
    const courseDocSnapshot = await getDoc(courseDocRef);

    if (courseDocSnapshot.exists()) {
      await updateDoc(courseDocRef, {
        groups: arrayUnion(groupRef.id),
      });
    } else {
      await setDoc(courseDocRef, { groups: [groupRef.id] });
    }

    const updateUserPromises = newArray.map(async (student) => {
      const userDocRef = doc(db, "user", student.id);
      const userDocSnapshot = await getDoc(userDocRef);

      const groupsCollectionRef = collection(userDocRef, "groups");

      const newGroupDocRef = await addDoc(groupsCollectionRef, {
        courseDocId: docId,
        groupId: groupRef.id,
        acceptedInvitation: student.acceptedInvitations,
        // tasks: [],
      });

      const existingGroupDocIDs = userDocSnapshot.exists()
        ? userDocSnapshot.data().groupDocID || []
        : [];
      const updatedGroupDocIDs = [...existingGroupDocIDs, newGroupDocRef.id];

      const groupQuerySnapshot = await getDocs(groupsCollectionRef);
      const groupsData = groupQuerySnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      await updateDoc(userDocRef, {
        groupDocID: updatedGroupDocIDs,
        groups: groupsData,
      });
    });

    await Promise.all(updateUserPromises);
  } catch (error) {
    console.error("Error creating group: ", error);
  }
};

export const UpdateAcceptedInvitations = async (id, courseDocId) => {
  try {
    // Reference to the specific document in the "user" collection based on the user's id
    const userDocRef = doc(db, "user", id);

    // Get the document snapshot
    const userDocSnapshot = await getDoc(userDocRef);

    // Check if the document exists
    if (userDocSnapshot.exists()) {
      // Extract the data from the document
      const userData = userDocSnapshot.data();

      // Extract the groups array from the user data
      const groups = userData.groups || [];

      // Map over the groups array and update the acceptedInvitation field
      const updatedGroups = groups.map((group) => {
        if (group.courseDocId === courseDocId) {
          return { ...group, acceptedInvitation: true };
        }
        return group;
      });

      // Update the document with the modified groups array
      await updateDoc(userDocRef, { groups: updatedGroups });
      console.log(`User document updated successfully for user with ID: ${id}`);
    } else {
      console.log(`User document with ID ${id} does not exist.`);
    }
  } catch (error) {
    console.error("Error updating users:", error);
  }
};

export const getCoursesWithAcceptedInvitations = async (uid) => {
  try {
    const userDocRef = doc(db, "user", uid);
    const userDocSnapshot = await getDoc(userDocRef);
    let coursesWithAcceptedInvitations = [];

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      if (userData.groups) {
        const acceptedGroups = userData.groups.filter(
          (group) => group.acceptedInvitation === true
        );
        const courseDocIds = acceptedGroups.map((group) => group.courseDocId);
        coursesWithAcceptedInvitations.push(...courseDocIds);
      }
    } else {
      console.log(`User document with UID ${uid} does not exist.`);
    }

    return coursesWithAcceptedInvitations;
  } catch (error) {
    console.error("Error retrieving courses with accepted invitations:", error);
    return [];
  }
};

export const createGroupCourse = async (studentIds, docId, userId) => {
  try {
    const groupCollectionRef = collection(db, "groups");
    const courseDocRef = doc(db, "courses", docId);
    console.log(userId);
    const userDocRef = doc(db, "user", userId);

    const groupData = {
      students: studentIds,
      courseId: docId,
      tasks: [],
    };

    const groupRef = await addDoc(groupCollectionRef, groupData);
    const updatedGroupData = {
      ...groupData,
      groupDocId: groupRef.id,
    };

    await setDoc(doc(db, "groups", groupRef.id), updatedGroupData, {
      merge: true,
    });

    await updateDoc(userDocRef, { groups: arrayUnion(groupRef.id) });
    await updateDoc(courseDocRef, { groups: arrayUnion(groupRef.id) });
  } catch (err) {
    console.error(err);
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
      where("students", "array-contains", studentId)
    );
    const groupsQuerySnapshot = await getDocs(groupsQuery);

    const courseIds = [];

    groupsQuerySnapshot.forEach((doc) => {
      const { courseId } = doc.data();
      courseIds.push(courseId);
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
      where("students", "array-contains", userId),
      where("courseId", "==", courseId)
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
      const { students } = groupData;

      const users = [];

      for (const studentId of students) {
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
