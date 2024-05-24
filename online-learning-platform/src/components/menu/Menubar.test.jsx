import React from 'react';
import { render, screen, act } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import MenubarCustom from './Menubar';
import { auth, signOut as mockSignOut } from "../../config/firebase"; // ensure path accuracy
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

vi.mock('../../config/firebase', () => {
  const originalModule = vi.importActual('../../config/firebase');
  return {
    ...originalModule,
    auth: {
      onAuthStateChanged: vi.fn()
    },
    signOut: vi.fn()
  };
});

const mockNavigate = vi.fn();

const setup = (initialEntry = "/", user = null) => {
  const userMock = user ? { displayName: user } : null;
  auth.onAuthStateChanged.mockImplementation(callback => {
    callback(userMock);
    return vi.fn(); 
  });

  return render(
    <RouterProvider router={createMemoryRouter([{ path: initialEntry, element: <MenubarCustom /> }], { initialEntries: [initialEntry] })} />
  );
};

vi.mock('react-router-dom', async () => {
  const client = await vi.importActual('react-router-dom');
  return {
    ...client,
    useNavigate: () => mockNavigate,
  };
});

describe('MenubarCustom Component', () => {
  // Existing tests broken down into smaller, focused tests
  test('renders the teacher "Create a course" menu item', () => {
    setup("/", "John - Teacher");
    expect(screen.getByText("Create a course")).toBeInTheDocument();
  });

  test('renders the teacher "My created courses" menu item', () => {
    setup("/", "John - Teacher");
    expect(screen.getByText("My created courses")).toBeInTheDocument();
  });

  test('renders the common "Home" menu item for a teacher', () => {
    setup("/", "John - Teacher");
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test('renders the common "Profile" menu item for a teacher', () => {
    setup("/", "John - Teacher");
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  test('does not render student-specific menu items for a teacher', () => {
    setup("/", "John - Teacher");
    expect(screen.queryByText("Find a course")).not.toBeInTheDocument();
    expect(screen.queryByText("Groups")).not.toBeInTheDocument();
  });

  test('renders the student "Find a course" menu item', () => {
    setup("/", "Jane-Doe - Student");
    expect(screen.getByText("Find a course")).toBeInTheDocument();
  });

  test('renders the student "Groups" menu item', () => {
    setup("/", "Jane-Doe - Student");
    expect(screen.getByText("Groups")).toBeInTheDocument();
  });

  test('does not render teacher-specific menu items for a student', () => {
    setup("/", "Jane-Doe - Student");
    expect(screen.queryByText("Create a course")).not.toBeInTheDocument();
    expect(screen.queryByText("My created courses")).not.toBeInTheDocument();
  });

  test('renders common "Home" and "Profile" menu items for a student', () => {
    setup("/", "Jane-Doe - Student");
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  test('shows logout button when user is authenticated', () => {
    setup("/", "Authenticated-User - Teacher");
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test('does not show logout button when user is not authenticated', () => {
    setup("/", null);
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  test('shows logo when user is not authenticated', () => {
    setup("/", null);
    expect(screen.getByText("collabLearn")).toBeInTheDocument();
  });

  test('underlines the profile menu item when navigating to it', async () => {
    const { container } = setup("/", "Zhypa - Student");
    const profileButton = screen.getByText("Profile");
    const homeButton = screen.getByText("Home");

    await act(async () => await userEvent.click(profileButton));

    expect(profileButton).toHaveClass('underline');
    expect(homeButton).not.toHaveClass('underline');
  });

  // Additional tests
  test('navigates to the "Create a course" page when the menu item is clicked', async () => {
    setup("/", "John - Teacher");
    const createCourseButton = screen.getByText("Create a course");

    await act(async () => await userEvent.click(createCourseButton));

    expect(mockNavigate).toHaveBeenCalledWith('/create');
  });

  test('navigates to the "My created courses" page when the menu item is clicked', async () => {
    setup("/", "John - Teacher");
    const myCreatedCoursesButton = screen.getByText("My created courses");

    await act(async () => await userEvent.click(myCreatedCoursesButton));

    expect(mockNavigate).toHaveBeenCalledWith('/createdcourses');
  });

  test('navigates to the "Find a course" page when the menu item is clicked', async () => {
    setup("/", "Jane-Doe - Student");
    const findCourseButton = screen.getByText("Find a course");

    await act(async () => await userEvent.click(findCourseButton));

    expect(mockNavigate).toHaveBeenCalledWith('/courses');
  });

  test('navigates to the "Groups" page when the menu item is clicked', async () => {
    setup("/", "Jane-Doe - Student");
    const groupsButton = screen.getByText("Groups");

    await act(async () => await userEvent.click(groupsButton));

    expect(mockNavigate).toHaveBeenCalledWith('/groups');
  });

  test('navigates to the "Home" page when the menu item is clicked', async () => {
    setup("/", "Jane-Doe - Student");
    const homeButton = screen.getByText("Home");

    await act(async () => await userEvent.click(homeButton));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to the "Profile" page when the menu item is clicked', async () => {
    setup("/", "Jane-Doe - Student");
    const profileButton = screen.getByText("Profile");

    await act(async () => await userEvent.click(profileButton));

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });
});
