import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  where,
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

// export const createGroupWithModifications = async (docId, selectedStudents) => {
//   try {
//     const groupCollectionRef = collection(db, "groups"); // Reference to the "groups" collection

//     const updatedSelectedStudents = selectedStudents.map((student) => ({
//       ...student,
//       acceptedInvitations: false, // Assuming initially all invitations are not accepted
//     }));

//     const myData = await fetchUserData();

//     const newArray = [
//       ...updatedSelectedStudents,
//       { ...myData, acceptedInvitations: true }, // Add the current user with acceptedInvitations: true
//     ];

//     const groupData = {
//       courseDocId: docId,
//       students: newArray,
//     };

//     // Add a new document to the "groups" collection
//     const groupRef = await addDoc(groupCollectionRef, groupData);

//     // Update the user collection to include the groupDocID for each user
//     const updateUserPromises = selectedStudents.map(async (student) => {
//       const userDocRef = doc(db, "user", student.id);

//       // Get the current groupDocID array or initialize an empty array
//       const userDocSnapshot = await getDoc(userDocRef);
//       const existingGroupDocIDs = userDocSnapshot.exists()
//         ? userDocSnapshot.data().groupDocID || []
//         : [];

//       // Update the groupDocID array with the new groupRef.id
//       const updatedGroupDocIDs = [...existingGroupDocIDs, groupRef.id];

//       // Update the user document with the updated groupDocID array
//       await updateDoc(userDocRef, { groupDocID: updatedGroupDocIDs });
//     });

//     // Wait for all user documents to be updated
//     await Promise.all(updateUserPromises);
//   } catch (error) {
//     console.error("Error creating group: ", error);
//   }
// };

export const createGroupWithModifications = async (docId, selectedStudents) => {
  try {
    const groupCollectionRef = collection(db, "groups");

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

    const updateUserPromises = newArray.map(async (student) => {
      const userDocRef = doc(db, "user", student.id);
      const userDocSnapshot = await getDoc(userDocRef);

      const groupsCollectionRef = collection(userDocRef, "groups");

      const newGroupDocRef = await addDoc(groupsCollectionRef, {
        courseDocId: docId,
        groupId: groupRef.id,
        acceptedInvitation: student.acceptedInvitations,
        tasks: [],
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

// export const UpdateAcceptedInvitations = async (courseDocId, userInfo) => {
//   try {
//     const groupCollectionRef = collection(db, "groups");
//     const querySnapshot = await getDocs(
//       query(groupCollectionRef, where("courseDocId", "==", courseDocId))
//     );

//     querySnapshot.forEach(async (doc) => {
//       // Update each document found in the query
//       await updateDoc(doc.ref, {
//         acceptedStudents: arrayUnion(userInfo),
//         groups: [],
//       });
//     });

//     console.log("Documents updated successfully!");
//   } catch (error) {
//     console.error("Error updating documents:", error);
//   }
// };

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
