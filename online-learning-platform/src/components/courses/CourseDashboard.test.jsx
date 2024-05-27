import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';  // Import act
import CourseDashboard from './CourseDashboard';
import { fetchCourses } from '../../controller/Courses';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const customRender = (component) => 
  render(
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
    await act(async () => {  
      customRender(<CourseDashboard />);
    });
    expect(screen.getByText('Course Dashboard')).toBeInTheDocument();
  });

  it('should render and display input search', async () => {
    fetchCourses.mockResolvedValue([]); 
    await act(async () => {  
      customRender(<CourseDashboard />);
    });
    expect(screen.getByPlaceholderText('Find the course')).toBeInTheDocument();
  });

  it('should fetch and display courses title', async () => {
    const mockCourses = [
      { docId: '1', title: 'Course 1', imageUrl: 'url1', description: 'Description 1' },
      { docId: '2', title: 'Course 2', imageUrl: 'url2', description: 'Description 2' }
    ];
    fetchCourses.mockResolvedValue(mockCourses);

    await act(async () => { 
      customRender(<CourseDashboard />);
    });
    await waitFor(() => {
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  it('should filter courses based on search input and clear again', async () => {
    const mockCourses = [
      { docId: '1', title: 'React Basics', imageUrl: 'url1', description: 'Learn React' },
      { docId: '2', title: 'Vue Essentials', imageUrl: 'url2', description: 'Learn Vue' }
    ];
    fetchCourses.mockResolvedValue(mockCourses);

    await act(async () => {  
      customRender(<CourseDashboard />);
    });
    const searchInput = screen.getByPlaceholderText('Find the course');

    await act(async () => {  
      await userEvent.type(searchInput, 'React');
    });

    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.queryByText('Vue Essentials')).not.toBeInTheDocument();
    });

    await act(async () => {  
      await userEvent.clear(searchInput);
    });

    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.getByText('Vue Essentials')).toBeInTheDocument();
    });
  });
});
