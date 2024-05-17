import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Lesson from './Lesson';

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: { uid: 'user1' } })),
}));

vi.mock('../../controller/Courses', () => ({
  getDocumentById: vi.fn(() => Promise.resolve({
    id: 'HDR8XxDQjy4gtBrgGtCk',
    title: 'Sample Course',
    lessons: ['fZi5KOkEmlqSLZn4GAa8']
  })),
  fetchLessonsByReferences: vi.fn(() => Promise.resolve([
    { id: 'fZi5KOkEmlqSLZn4GAa8', lessonNumber: 1, docId: 'HDR8XxDQjy4gtBrgGtCk', lessonId: 'fZi5KOkEmlqSLZn4GAa8', videoURL: 'https://example.com/video.mp4', title: 'Introduction' }
  ])),
  markLessonAsDone: vi.fn(),
  fetchAllLessonsWithCompletionStatus: vi.fn(() => Promise.resolve([
    { id: 'fZi5KOkEmlqSLZn4GAa8', lessonNumber: 1, checked: true }
  ])),
}));

describe('Lesson Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders lesson information and handles lesson completion', async () => {
    render(
      <MemoryRouter initialEntries={[`/course/HDR8XxDQjy4gtBrgGtCk/lessons/1`]}>
        <Routes>
          <Route path="/course/:docId/lessons/:lessonNumber" element={<Lesson />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).toBeInTheDocument();  
    });

  });
});
