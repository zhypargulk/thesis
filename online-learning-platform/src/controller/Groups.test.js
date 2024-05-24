import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchStudentCoursesAndGroups,
  addLeaderToGroup,
  updateGroupAnswer,
  fetchStudentsInGroup,
  getCourseByRef,
  getLeaderByRef,
  getCourseByGroupId,
} from "./Groups";
import { db } from "../config/firebase";
import { updateDoc, doc, getDoc, getDocs } from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  where: vi.fn(),
  setDoc: vi.fn(),
  arrayUnion: vi.fn(),
  query: vi.fn(),
}));

vi.mock("../config/firebase", () => ({
  auth: {
    currentUser: { uid: "testUserId" },
  },
  db: {},
}));

vi.mock("./User", () => ({
  fetchUserData: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();

  doc.mockImplementation((db, collectionName, id) => ({
    id,
    collectionName,
    path: `${collectionName}/${id}`,
  }));
});

describe("GroupsCourses functions", () => {
  it("fetchStudentCoursesAndGroups should fetch courses and groups for a given student", async () => {
    const mockGroupData = {
      courseDocRef: { id: "course1" },
    };
    const mockCourseData = {
      title: "Course 1",
      imageUrl: "image1.jpg",
    };
    const groupSnapshot = {
      docs: [{ id: "group1", data: () => mockGroupData }],
    };
    getDocs.mockResolvedValue(groupSnapshot);
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockCourseData,
    });

    const coursesAndGroups = await fetchStudentCoursesAndGroups("testUserId");

    expect(getDocs).toHaveBeenCalled();
    expect(getDoc).toHaveBeenCalled();
    expect(coursesAndGroups).toEqual([
      {
        groupId: "group1",
        courseId: "course1",
        title: "Course 1",
        imageUrl: "image1.jpg",
      },
    ]);
  });

  it("fetchStudentCoursesAndGroups should return an empty array if there is an error fetching data", async () => {
    getDocs.mockRejectedValue(new Error("Error fetching data"));

    const coursesAndGroups = await fetchStudentCoursesAndGroups("testUserId");

    expect(getDocs).toHaveBeenCalled();
    expect(coursesAndGroups).toEqual([]);
  });

  it("addLeaderToGroup should add a leader to a group", async () => {
    await addLeaderToGroup("group1", "user1");

    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      leaderGroup: expect.any(Object),
    });
  });

  it("updateGroupAnswer should update the group answer status", async () => {
    await updateGroupAnswer("group1", "newStatus");

    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      success: "newStatus",
    });
  });

  it("fetchStudentsInGroup should fetch students in a group", async () => {
    const mockGroupData = {
      students: [doc(db, "user", "student1"), doc(db, "user", "student2")],
    };
    const mockStudent1 = {
      id: "student1",
      exists: () => true,
      data: () => ({ name: "Student 1" }),
    };
    const mockStudent2 = {
      id: "student2",
      exists: () => true,
      data: () => ({ name: "Student 2" }),
    };

    getDoc
      .mockResolvedValueOnce({ exists: () => true, data: () => mockGroupData })
      .mockResolvedValueOnce(mockStudent1)
      .mockResolvedValueOnce(mockStudent2);

    const students = await fetchStudentsInGroup("group1");

    expect(getDoc).toHaveBeenCalledTimes(3);
    expect(students).toEqual([
      { id: "student1", name: "Student 1" },
      { id: "student2", name: "Student 2" },
    ]);
  });

  it("fetchStudentsInGroup should return an empty array if group does not exist", async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });

    const students = await fetchStudentsInGroup("group1");

    expect(getDoc).toHaveBeenCalled();
    expect(students).toEqual([]);
  });

  it("getCourseByRef should fetch course data by reference", async () => {
    const mockCourseData = { title: "Course 1" };
    getDoc.mockResolvedValue({ data: () => mockCourseData });

    const courseData = await getCourseByRef(doc(db, "courses", "course1"));

    expect(getDoc).toHaveBeenCalled();
    expect(courseData).toEqual(mockCourseData);
  });

  it("getLeaderByRef should fetch leader data by reference", async () => {
    const mockLeaderData = { name: "Leader 1" };
    getDoc.mockResolvedValue({ data: () => mockLeaderData });

    const leaderData = await getLeaderByRef(doc(db, "user", "leader1"));

    expect(getDoc).toHaveBeenCalled();
    expect(leaderData).toEqual(mockLeaderData);
  });

  it("getCourseByGroupId should fetch course data by group ID", async () => {
    const mockGroupData = {
      courseDocRef: doc(db, "courses", "course1"),
    };
    const mockCourseData = { title: "Course 1" };

    getDoc
      .mockResolvedValueOnce({ exists: () => true, data: () => mockGroupData })
      .mockResolvedValueOnce({ data: () => mockCourseData });

    const courseData = await getCourseByGroupId("group1");

    expect(getDoc).toHaveBeenCalledTimes(2);
    expect(courseData).toEqual(mockCourseData);
  });
});
