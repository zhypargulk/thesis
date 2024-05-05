import React from 'react';
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import MenubarCustom from './Menubar';
import { auth } from "../../config/firebase"; // ensure path accuracy
import { act } from "@testing-library/react";

// Mocking the Firebase auth and hooks
jest.mock('../../config/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn()
  }
}));

// Helper function to setup tests with router context
const setup = (initialEntry = "/", user = null) => {
  const userMock = user ? { displayName: user } : null;
  auth.onAuthStateChanged.mockImplementation(callback => {
    callback(userMock);
    return jest.fn(); // mock the unsubscribe function
  });

  return render(
    <RouterProvider router={createMemoryRouter([{ path: initialEntry, element: <MenubarCustom /> }], { initialEntries: [initialEntry] })} />
  );
};

// Test cases
describe('MenubarCustom Component', () => {
  test('renders the teacher menu items when user is a teacher', () => {
    setup("/", "John - Teacher");
    expect(screen.getByText("Create a course")).toBeInTheDocument();
    expect(screen.getByText("My created courses")).toBeInTheDocument();
  });

  test('renders the student menu items when user is not a teacher', () => {
    setup("/", "Jane-Doe - Student");
    expect(screen.getByText("Find a course")).toBeInTheDocument();
    expect(screen.queryByText("Create a course")).not.toBeInTheDocument();
  });

  test('shows logout button when user is authenticated', () => {
    setup("/", "Authenticated-User - Teacher");
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test('does not show logout button when user is not authenticated', () => {
    setup("/", null); // No user authenticated
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });
});
