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
    // Create a query to get all tasks belonging to the specified group ID
    const tasksRef = collection(db, "tasks");
    const tasksQuery = query(tasksRef, where("group_id", "==", groupId));

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

export const createTask = async (userId, groupId, status, description) => {
  try {
    const taskRef = await addDoc(collection(db, "tasks"), {
      user_id: userId,
      group_id: groupId,
      status: status,
      description: description,
    });

    // Update the user document to include the newly created task
    const userDocRef = doc(db, "user", userId);
    console.log("user=", userDocRef.id);
    await updateDoc(userDocRef, {
      tasks: arrayUnion(taskRef.id), // Append the task ID to the 'tasks' array
    });

    // Update the group document to include the newly created task
    const groupDocRef = doc(db, "groups", groupId);
    await updateDoc(groupDocRef, {
      tasks: arrayUnion(taskRef.id), // Append the task ID to the 'tasks' array
    });

    console.log("Task created with ID:", taskRef.id);
    return taskRef.id; // Return the ID of the newly created task document
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
    console.log(`Task ${taskId} updated to status: ${newStatus}`);
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
      tasks.push({ _id: doc.id, ...doc.data() }); // Ensure this structure matches your existing tasks
    });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};
