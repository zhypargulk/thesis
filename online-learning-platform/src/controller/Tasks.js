// firestoreUtils.js

import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  where,
  query,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export const getAllTasks = async (groupId) => {
  try {
    const tasksRef = collection(db, "tasks");

    const groupRef = doc(db, "groups", groupId);

    const tasksQuery = query(tasksRef, where("groupRef", "==", groupRef));

    const taskSnapshot = await getDocs(tasksQuery);

    const tasks = [];

    taskSnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const createTask = async (
  userId,
  groupId,
  status,
  description,
  title,
  courseId
) => {
  try {
    const userDocRef = doc(db, "user", userId);
    const groupDocRef = doc(db, "groups", groupId);
    const courseDocRef = doc(db, "courses", courseId);
    const tasksRef = collection(db, "tasks");

    const taskRef = await addDoc(tasksRef, {
      userRef: userDocRef,
      groupRef: groupDocRef,
      courseRef: courseDocRef,
      status: status,
      description: description,
      title: title,
    });

    await updateDoc(userDocRef, {
      tasks: arrayUnion(taskRef.id),
    });

    await updateDoc(taskRef, {
      _id: taskRef.id,
    });

    await updateDoc(groupDocRef, {
      tasks: arrayUnion(taskRef.id),
    });

    return taskRef.id;
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
};

export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const taskDocRef = doc(db, "tasks", taskId);
    await updateDoc(taskDocRef, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

export const getAllTasksBoard = async (groupId) => {
  try {
    const tasksRef = collection(db, "tasks");
    const tasksQuery = query(tasksRef, where("group_id", "==", groupId));
    const taskSnapshot = await getDocs(tasksQuery);
    const tasks = [];
    taskSnapshot.forEach((doc) => {
      tasks.push({ _id: doc.id, ...doc.data() });
    });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const uploadTheTask = async (taskId, code) => {
  try {
    const taskDocRef = doc(db, "tasks", taskId);
    await updateDoc(taskDocRef, {
      code: code,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

export const updateGroupTaskStatus = async (groupId, output, finishedTask) => {
  const groupDocRef = doc(db, "groups", groupId);

  try {
    await updateDoc(groupDocRef, {
      output: output,
      finishedTask: finishedTask,
    });
  } catch (error) {
    console.error("Error updating the group:", error);
  }
};
