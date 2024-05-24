import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllEnrolledStudents } from "./Students";
import { doc, getDoc } from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
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

describe("getAllEnrolledStudents", () => {
  it("should fetch all enrolled students for a given course", async () => {
    const mockCourseData = {
      students: [
        {
          id: "student1",
          exists: () => true,
          data: () => ({ name: "Student 1" }),
        },
        {
          id: "student2",
          exists: () => true,
          data: () => ({ name: "Student 2" }),
        },
      ],
    };

    const courseSnapshot = {
      data: () => mockCourseData,
    };

    getDoc
      .mockResolvedValueOnce(courseSnapshot)
      .mockResolvedValueOnce(mockCourseData.students[0])
      .mockResolvedValueOnce(mockCourseData.students[1]);

    const enrolledStudents = await getAllEnrolledStudents("testCourseId");

    expect(getDoc).toHaveBeenCalledTimes(3);
    expect(enrolledStudents).toEqual([
      { name: "Student 1" },
      { name: "Student 2" },
    ]);
  });

  it("should return an empty array if there is an error fetching data", async () => {
    getDoc.mockRejectedValue(new Error("Error fetching data"));

    const enrolledStudents = await getAllEnrolledStudents("testCourseId");

    expect(getDoc).toHaveBeenCalled();
    expect(enrolledStudents).toEqual([]);
  });
});
