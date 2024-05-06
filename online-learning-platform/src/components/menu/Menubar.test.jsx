import React from 'react';
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import MenubarCustom from './Menubar';
import { auth } from "../../config/firebase"; // ensure path accuracy
import { act } from "@testing-library/react";

import { vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';

vi.mock('../../config/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn()
  }
}));

const mockNavigate = vi.fn()

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
  const res = {
    ...(client ),
    useNavigate: () => mockNavigate,
  };

  return res;
});

describe('MenubarCustom Component', () => {
  test('renders the teacher menu items when user is a teacher', () => {
    setup("/", "John - Teacher");
    expect(screen.getByText("Create a course")).toBeInTheDocument();
    expect(screen.getByText("My created courses")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("My created courses")).toBeInTheDocument();

    expect(screen.queryByText("Find a course")).not.toBeInTheDocument();
    expect(screen.queryByText("Groups")).not.toBeInTheDocument();
  });

  test('renders the student menu items when user is not a teacher', () => {
    setup("/", "Jane-Doe - Student");
    expect(screen.getByText("Find a course")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Groups")).toBeInTheDocument();

    expect(screen.queryByText("Create a course")).not.toBeInTheDocument();
  });

  test('shows logout button when user is authenticated', () => {
    setup("/", "Authenticated-User - Teacher");
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test('does not show logout button when user is not authenticated, shows logo', () => {
    setup("/", null);
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    expect(screen.getByText("collabLearn")).toBeInTheDocument();
  });

  test('underlines when navigate to the new page', async() => {
    const {container} = setup("/", "Zhypa - Student");
    const profileButton = (screen.getByText("Profile"));
    const homeButton = (screen.getByText("Home"));

    await act (async() => await userEvent.click(profileButton));

    expect(profileButton).toHaveClass('underline');
    expect(homeButton).not.toHaveClass('underline');
  });
});
