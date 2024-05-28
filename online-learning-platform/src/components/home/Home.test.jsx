import { render , screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { auth } from "../../config/firebase";
import { act } from "@testing-library/react";
import { expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import Home from './Home';

vi.mock('../../config/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn()
  }
}));

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const client = await vi.importActual('react-router-dom');
  const res = {
    ...(client ),
    useNavigate: () => mockNavigate,
  };

  return res;
});

const setup = (initialEntry = "/", user = null) => {
  const userMock = user ? { displayName: user } : null;
  auth.onAuthStateChanged.mockImplementation(callback => {
    callback(userMock);
    return vi.fn(); 
  });

  return render(
    <RouterProvider router={createMemoryRouter([{ path: initialEntry, element: <Home /> }], { initialEntries: [initialEntry] })} />
  );
};

describe('MenubarCustom Component', () => {
  test('mount title and header', async() => {
  setup("/", "John - Teacher");
  const title = screen.getByText('Welcome!');
  const title2 = screen.getByText('It is an online learning platform for');
  expect(title).toBeInTheDocument();
  expect(title2).toBeInTheDocument();
  });

  test('renders the teacher home page', async() => {
    setup("/", "John - Teacher");
    const buttonCreateCourse = screen.getByText('Create a new course');
    expect(buttonCreateCourse).toBeInTheDocument();
  
    await act( () => {
       userEvent.click(buttonCreateCourse);  })
    });

    test('renders the student home page', async() => {
      setup("/", "John - Student");
      const buttonCreateCourse = screen.getByText('Explore courses');
      expect(buttonCreateCourse).toBeInTheDocument();
    
      await act( () => {
         userEvent.click(buttonCreateCourse);  })
   });
});
