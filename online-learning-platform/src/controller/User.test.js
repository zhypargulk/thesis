import { describe, it, expect, vi } from "vitest";
import { fetchUserData, updateProfileData, userPasswordReset } from "./User";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";

vi.mock("firebase/firestore", () => ({
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  updatePassword: vi.fn(),
}));

vi.mock("../config/firebase", () => ({
  auth: {
    currentUser: { uid: "testUserId" },
  },
  db: {},
}));

describe("fetchUserData", () => {
  it("should fetch user data if user is authenticated", async () => {
    const mockData = { name: "John Doe" };
    getDoc.mockResolvedValue({ exists: () => true, data: () => mockData });

    const data = await fetchUserData("testUserId");
    expect(getDoc).toHaveBeenCalled();
    expect(data).toEqual(mockData);
  });
});

describe("updateProfileData", () => {
  it("should update user profile data", async () => {
    const mockUserDocRef = { id: "testUserId" };
    const mockData = { name: "Jane Doe" };

    await updateProfileData(mockUserDocRef, mockData);
    expect(updateDoc).toHaveBeenCalledWith(mockUserDocRef, mockData);
  });
});

describe("userPasswordReset", () => {
  it("should update the user password", async () => {
    const mockUser = { uid: "testUserId" };
    const newPassword = "newPassword123";

    updatePassword.mockResolvedValue();

    const result = await userPasswordReset(mockUser, newPassword);
    expect(updatePassword).toHaveBeenCalledWith(mockUser, newPassword);
    expect(result).toBe(true);
  });

  it("should return false if there is an error updating password", async () => {
    const mockUser = { uid: "testUserId" };
    const newPassword = "newPassword123";

    updatePassword.mockRejectedValue(new Error("Error"));

    const result = await userPasswordReset(mockUser, newPassword);
    expect(updatePassword).toHaveBeenCalledWith(mockUser, newPassword);
    expect(result).toBe(false);
  });
});
