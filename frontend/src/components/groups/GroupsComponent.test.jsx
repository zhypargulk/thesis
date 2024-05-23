import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import GroupsComponent from "./GroupsComponent";
import { fetchStudentCoursesAndGroups } from "../../controller/Groups";
import { useAuth } from "../../context/AuthContext";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(() => ({ uid: "user1" })),
}));

vi.mock("../../controller/Groups", () => ({
  fetchStudentCoursesAndGroups: vi.fn(),
}));

describe("GroupsComponent", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it("should render and display initial UI elements", async () => {
    fetchStudentCoursesAndGroups.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <GroupsComponent />
      </BrowserRouter>
    );

    expect(screen.getByText("Your groups")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Find the course")).toBeInTheDocument();
  });

  it("should fetch and display groups", async () => {
    const mockGroups = [
      { groupId: "g1", title: "Group 1", imageUrl: "url1" },
      { groupId: "g2", title: "Group 2", imageUrl: "url2" },
    ];
    fetchStudentCoursesAndGroups.mockResolvedValue(mockGroups);

    render(
      <BrowserRouter>
        <GroupsComponent />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Group 1")).toBeInTheDocument();
      expect(screen.getByText("Group 2")).toBeInTheDocument();
    });
  });

  it("should display message when no groups are found", async () => {
    fetchStudentCoursesAndGroups.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <GroupsComponent />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("You are not in any group")).toBeInTheDocument();
    });
  });
});
