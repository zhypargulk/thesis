import { fetchUserData, updateProfileData, userPasswordReset } from "./User";
import { auth, db } from "../config/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  updatePassword: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe("Firebase Functions", () => {
  describe("fetchUserData", () => {
    it("should fetch user data if user exists", async () => {
      const mockUserSnapshot = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue({
          /* mocked user data */
        }),
      };

      doc.mockReturnValue({
        /* mocked user doc */
      });
      getDoc.mockResolvedValue(mockUserSnapshot);

      const userData = await fetchUserData("userId");

      expect(userData).toEqual({
        /* expected user data */
      });
    });

    it("should handle errors when fetching user data", async () => {
      doc.mockReturnValue({
        /* mocked user doc */
      });
      getDoc.mockRejectedValue(new Error("Fetch error"));

      await expect(fetchUserData("userId")).rejects.toThrow("Fetch error");
    });
  });

  describe("updateProfileData", () => {
    it("should update user profile data", async () => {
      const mockUserDocRef = {
        /* mocked user doc reference */
      };
      const mockData = {
        /* mocked profile data */
      };

      await updateProfileData(mockUserDocRef, mockData);

      expect(updateDoc).toHaveBeenCalledWith(mockUserDocRef, mockData);
    });

    it("should handle errors when updating user profile data", async () => {
      const mockUserDocRef = {
        /* mocked user doc reference */
      };
      const mockData = {
        /* mocked profile data */
      };

      updateDoc.mockRejectedValue(new Error("Update error"));

      await expect(updateProfileData(mockUserDocRef, mockData)).rejects.toThrow(
        "Update error"
      );
    });
  });

  describe("userPasswordReset", () => {
    it("should update user password and return true", async () => {
      const mockUser = {
        /* mocked user object */
      };
      const newPassword = "newPassword";

      await expect(userPasswordReset(mockUser, newPassword)).resolves.toBe(
        true
      );
      expect(updatePassword).toHaveBeenCalledWith(mockUser, newPassword);
    });

    it("should handle errors when updating user password and return false", async () => {
      const mockUser = {
        /* mocked user object */
      };
      const newPassword = "newPassword";

      updatePassword.mockRejectedValue(new Error("Password update error"));

      await expect(userPasswordReset(mockUser, newPassword)).resolves.toBe(
        false
      );
      expect(updatePassword).toHaveBeenCalledWith(mockUser, newPassword);
    });
  });
});
