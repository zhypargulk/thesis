import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { fetchUserData } from "../controller/User";

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

    const myData = await fetchUserData();

    const newArray = [
      ...updatedSelectedStudents,
      { ...myData, acceptedInvitations: true },
    ];

    const groupData = {
      courseDocId: docId,
      students: newArray,
    };
    const groupRef = await addDoc(groupCollectionRef, groupData);

    const updateUserPromises = selectedStudents.map(async (student) => {
      const userDocRef = doc(db, "user", student.id);
      const userDocSnapshot = await getDoc(userDocRef);

      const groupsCollectionRef = collection(userDocRef, "groups");

      const newGroupDocRef = await addDoc(groupsCollectionRef, {
        groupId: groupRef.id,
        acceptedInvitation: false,
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
