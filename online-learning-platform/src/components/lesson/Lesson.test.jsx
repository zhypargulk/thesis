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

const mockCourseData = {
  title: 'Test Course',
  lessons: [{ id: 'lesson1' }, { id: 'lesson2' }],
};

const mockLessonData = [
  { id: 'lesson1', lessonNumber: 1, title: 'Lesson 1', videoURL: 'video1.mp4', description: 'Lesson 1 Description', checked: false },
  { id: 'lesson2', lessonNumber: 2, title: 'Lesson 2', videoURL: 'video2.mp4', description: 'Lesson 2 Description', checked: true },
];

const mockLessonsWithStatus = [
  { id: 'lesson1', lessonNumber: 1, title: 'Lesson 1', videoURL: 'video1.mp4', description: 'Lesson 1 Description', checked: false },
  { id: 'lesson2', lessonNumber: 2, title: 'Lesson 2', videoURL: 'video2.mp4', description: 'Lesson 2 Description', checked: true },
];

describe('Lesson Component', () => {
  beforeEach(() => {
    Courses.getDocumentById.mockResolvedValue(mockCourseData);
    Courses.fetchLessonsByReferences.mockResolvedValue(mockLessonData);
    Courses.fetchAllLessonsWithCompletionStatus.mockResolvedValue(mockLessonsWithStatus);
    useAuth.mockReturnValue({ uid: 'user123' });
  });

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

  // test('renders lesson data', async () => {
  //   await act(async () => {
  //     setup();
  //   });

  //   expect(screen.getByText('Test Course')).toBeInTheDocument();
  //   expect(screen.getByText('Lesson 1')).toBeInTheDocument();
  //   expect(screen.getByText('Lesson 1 Description')).toBeInTheDocument();
  // });

  // test('navigates to next lesson', async () => {
  //   await act(async () => {
  //     setup('/course/docId/lessons/1');
  //   });

  //   const nextButton = screen.getByText('Next lesson');
  //   await act(async () => {
  //     userEvent.click(nextButton);
  //   });

  //   expect(mockNavigate).toHaveBeenCalledWith('/course/docId/lessons/2');
  // });

  // test('marks lesson as complete', async () => {
  //   await act(async () => {
  //     setup('/course/docId/lessons/1');
  //   });

  //   const markAsDoneButton = screen.getByText('Mark the lesson as done');
  //   await act(async () => {
  //     userEvent.click(markAsDoneButton);
  //   });

  //   expect(Courses.markLessonAsDone).toHaveBeenCalledWith('lesson1', 'user123');
  // });

  test('renders progress spinner when loading', async () => {
    useAuth.mockReturnValueOnce(null);
    setup('/course/docId/lessons/1');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // test('renders Go to Project button for the last lesson', async () => {
  //   await act(async () => {
  //     setup('/course/docId/lessons/2');
  //   });

  //   const projectButton = screen.getByText('Go to Project');
  //   expect(projectButton).toBeInTheDocument();
  // });
});
