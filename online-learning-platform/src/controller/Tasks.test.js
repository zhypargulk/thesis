import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllTasks,
  createTask,
  updateTaskStatus,
  uploadTheTask,
  updateGroupTaskStatus,
} from "./Tasks";
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

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  where: vi.fn(),
  query: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  arrayUnion: vi.fn(),
}));

vi.mock("../config/firebase", () => ({
  db: {},
}));

beforeEach(() => {
  vi.resetAllMocks();

  doc.mockImplementation((db, collectionName, id) => ({
    id,
    collectionName,
    path: `${collectionName}/${id}`,
  }));
});

describe("getAllTasks", () => {
  it("should fetch all tasks for a given group", async () => {
    const mockTasks = [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
    ];
    const taskSnapshot = {
      forEach: (callback) => {
        mockTasks.forEach((task) =>
          callback({ id: task.id, data: () => task })
        );
      },
    };

    getDocs.mockResolvedValue(taskSnapshot);

    const tasks = await getAllTasks("testGroupId");
    expect(getDocs).toHaveBeenCalled();
    expect(tasks).toEqual(mockTasks);
  });
});

describe("createTask", () => {
  it("should create a new task and update related documents", async () => {
    const mockTaskRef = { id: "task1" };
    addDoc.mockResolvedValue(mockTaskRef);

    const taskId = await createTask(
      "testUserId",
      "testGroupId",
      "pending",
      "Task description",
      "Task title",
      "testCourseId"
    );

    expect(addDoc).toHaveBeenCalled();
    expect(updateDoc).toHaveBeenCalledTimes(3); // user, task, and group updates
    expect(taskId).toBe(mockTaskRef.id);
  });
});

describe("updateTaskStatus", () => {
  it("should update the status of a task", async () => {
    await updateTaskStatus("task1", "completed");

    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      status: "completed",
    });
  });
});

describe("uploadTheTask", () => {
  it("should upload the code for a task", async () => {
    await uploadTheTask("task1", "code content");

    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      code: "code content",
    });
  });
});

describe("updateGroupTaskStatus", () => {
  it("should update the group with output and finished task", async () => {
    await updateGroupTaskStatus("group1", "output data", "task1");

    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      output: "output data",
      finishedTask: "task1",
    });
  });
});
