import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyCreatedCourses from './MyCreatedCourses';
import { BrowserRouter } from 'react-router-dom';
import { fetchMyCreatedCourses } from '../../controller/Courses';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../controller/Courses', () => ({
  fetchMyCreatedCourses: vi.fn()
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn()
}));


const coursesMock = [
  { docId: '1', title: 'React 101', imageUrl: 'url1', description: 'Intro to React' },
  { docId: '2', title: 'Vue Essentials', imageUrl: 'url2', description: 'Basics of Vue' }
];

const render = (component) => 
  rtlRender(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );

describe('MyCreatedCourses Component', () => {
  it('renders and fetches courses correctly', async () => {
    useAuth.mockReturnValue({ uid: '123' }); 
    fetchMyCreatedCourses.mockResolvedValue(coursesMock);
    
    render(<MyCreatedCourses />);
    
    await waitFor(() => {
      expect(fetchMyCreatedCourses).toHaveBeenCalledWith('123');
      expect(screen.getByText('React 101')).toBeInTheDocument();
      expect(screen.getByText('Vue Essentials')).toBeInTheDocument();
    });
  });

  it('filters courses based on search term', async () => {
    useAuth.mockReturnValue({ uid: '123' });
    fetchMyCreatedCourses.mockResolvedValue(coursesMock);
    
    render(<MyCreatedCourses />);

    
    await waitFor(() => {
      expect(screen.getByText('React 101')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Find the course');
    userEvent.type(input, 'vue');
    
    await waitFor(() => {
      expect(screen.queryByText('React 101')).not.toBeInTheDocument();
      expect(screen.getByText('Vue Essentials')).toBeInTheDocument();
    });
  });

  it('displays a message when no courses are created', async () => {
    useAuth.mockReturnValue({ uid: '123' });
    fetchMyCreatedCourses.mockResolvedValue([]);
    render(<MyCreatedCourses />);

    
    await waitFor(() => {
      expect(screen.getByText("You haven't created any course")).toBeInTheDocument();
    });
  });
});
