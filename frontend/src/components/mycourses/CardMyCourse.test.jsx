import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import CardMyCourse from './CardMyCourse';
import { useAuth } from "../../context/AuthContext";
import { fetchLastCompletedLesson } from "../../controller/Courses";

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../controller/Courses', () => ({
  fetchLastCompletedLesson: vi.fn()
}));


describe('CardMyCourse Component', () => {
  beforeEach(() => {
    useAuth.mockImplementation(() => ({ uid: '123' }));
    fetchLastCompletedLesson.mockResolvedValue(1);
  });

  test('mount data of course', async () => {
    const mockCourse = {
      title: "Introduction to Programming",
      imageUrl: "http://example.com/image.png",
      desc: "This is a short description of the course.",
      id: "course1",
      groupId: "group1"
    };

    render(
      <BrowserRouter>
        <CardMyCourse {...mockCourse} />
      </BrowserRouter>
    );

    
    expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
    expect(screen.getByText(/This is a short description/i)).toBeInTheDocument();
  });

  test('show more/less description', async () => {
    const mockCourse = {
      title: "Introduction to Programming",
      imageUrl: "http://example.com/image.png",
      desc: "This is not a short description of the course. This is not a short description of the course. This is not a short description of the course.",
      id: "course1",
      groupId: "group1"
    };

    render(
      <BrowserRouter>
        <CardMyCourse {...mockCourse} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
    const showMoreButton = screen.getByText("Show More");
    await userEvent.click(showMoreButton);

    await waitFor(() => {
      expect(screen.getByText("Show Less")).toBeInTheDocument();
    });

    const continueButton = screen.getByText("Continue lessons");
    await userEvent.click(continueButton);
  });
});
