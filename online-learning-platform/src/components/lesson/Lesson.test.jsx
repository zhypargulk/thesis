import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Lesson from './Lesson';
import * as Courses from '../../controller/Courses';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

vi.mock('../../controller/Courses', () => ({
  getDocumentById: vi.fn(),
  fetchLessonsByReferences: vi.fn(),
  markLessonAsDone: vi.fn(),
  fetchAllLessonsWithCompletionStatus: vi.fn(),
  parseContent: vi.fn((content) => content),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const client = await vi.importActual('react-router-dom');
  return {
    ...client,
    useNavigate: () => mockNavigate,
  };
});


describe('Lesson Component', () => {


  const setup = (initialEntry = '/course/docId/lessons/1') => {
    return render(
      <RouterProvider
        router={createMemoryRouter(
          [{ path: initialEntry, element: <Lesson /> }],
          { initialEntries: [initialEntry] }
        )}
      />
    );
  };


  test('renders progress spinner when loading', async () => {
    useAuth.mockReturnValueOnce(null);
    setup('/course/docId/lessons/1');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

});
