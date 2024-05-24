import React from 'react';
import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseDashboard from './CourseDashboard';
import { fetchCourses } from '../../controller/Courses';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const render = (component) => 
  rtlRender(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );

vi.mock('../../controller/Courses', () => ({
  fetchCourses: vi.fn(),
}));

describe('CourseDashboard Component', () => {
  it('should render and display initial title', async () => {
    fetchCourses.mockResolvedValue([]); 
    render(<CourseDashboard />);
    expect(screen.getByText('Course Dashboard')).toBeInTheDocument();
  });

  it('should render and display input search', async () => {
    fetchCourses.mockResolvedValue([]); 
    render(<CourseDashboard />);
    expect(screen.getByPlaceholderText('Find the course')).toBeInTheDocument();
  });

  it('should fetch and display courses title', async () => {
    const mockCourses = [
      { docId: '1', title: 'Course 1', imageUrl: 'url1', description: 'Description 1' },
      { docId: '2', title: 'Course 2', imageUrl: 'url2', description: 'Description 2' }
    ];
    fetchCourses.mockResolvedValue(mockCourses);

    render(<CourseDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  it('should fetch and display courses description', async () => {
    const mockCourses = [
      { docId: '1', title: 'Course 1', imageUrl: 'url1', description: 'Description 1' },
      { docId: '2', title: 'Course 2', imageUrl: 'url2', description: 'Description 2' }
    ];
    fetchCourses.mockResolvedValue(mockCourses);

    render(<CourseDashboard />);
    await waitFor(() => {
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  it('should filter courses based on search input', async () => {
    const mockCourses = [
      { docId: '1', title: 'React Basics', imageUrl: 'url1', description: 'Learn React' },
      { docId: '2', title: 'Vue Essentials', imageUrl: 'url2', description: 'Learn Vue' }
    ];
    fetchCourses.mockResolvedValue(mockCourses);

    render(<CourseDashboard />);
    const searchInput = screen.getByPlaceholderText('Find the course');

    await userEvent.type(searchInput, 'React');

    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.queryByText('Vue Essentials')).not.toBeInTheDocument();
    });
  });

  it('should filter courses based on search input and clear again', async () => {
    const mockCourses = [
      { docId: '1', title: 'React Basics', imageUrl: 'url1', description: 'Learn React' },
      { docId: '2', title: 'Vue Essentials', imageUrl: 'url2', description: 'Learn Vue' }
    ];
    fetchCourses.mockResolvedValue(mockCourses);

    render(<CourseDashboard />);
    const searchInput = screen.getByPlaceholderText('Find the course');

    await userEvent.type(searchInput, 'React');

    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.queryByText('Vue Essentials')).not.toBeInTheDocument();
    });

    await userEvent.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.queryByText('Vue Essentials')).toBeInTheDocument();
    });


  });
});
