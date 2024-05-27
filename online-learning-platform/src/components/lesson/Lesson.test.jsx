import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Lesson from './Lesson';
import { vi } from 'vitest';

vi.mock('../../controller/Courses', () => ({
  getDocumentById: vi.fn(() => Promise.resolve({ title: 'Sample Course', lessons: [] })),
  fetchLessonsByReferences: vi.fn(() => Promise.resolve([])),
  markLessonAsDone: vi.fn(() => Promise.resolve()),
  fetchAllLessonsWithCompletionStatus: vi.fn(() => Promise.resolve([])),
  parseContent: vi.fn(content => content),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ uid: '12345' })),
}));

vi.mock('react-router-dom', async () => {
  const actualRouterDom = await vi.importActual('react-router-dom');
  return {
    ...actualRouterDom,
    useNavigate: () => vi.fn(),
  };
});

describe('Lesson Component', () => {
  const setup = (initialEntry = '/course/docId/lessons/1') => {
    render(
      <RouterProvider
        router={createMemoryRouter(
          [{ path: initialEntry, element: <Lesson /> }],
          { initialEntries: [initialEntry] }
        )}
      />
    );
  };

  test('renders progress spinner when loading', async () => {
    setup('/course/docId/lessons/1');
    await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  });
});
