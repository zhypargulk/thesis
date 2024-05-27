import React from 'react';
import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseDetails from './CourseDetails';
import { describe, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { act } from '@testing-library/react'; 

vi.mock('../../config/firebase', () => ({
    auth: {
      currentUser: {
        uid: 'testUid',
        email: 'test@example.com'
      },
      onAuthStateChanged: vi.fn((callback) => {
        callback({
          uid: 'testUid',
          email: 'test@example.com'
        });
  
        return () => {};
      })
    }
  }));
  

const render = (component) => 
  rtlRender(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );

  vi.mock('../../controller/Courses', () => ({
    fetchCourses: vi.fn(() => Promise.resolve([])),
    getDocumentById: vi.fn(() => Promise.resolve({ title: 'Sample Course', description: 'A great course', docId: '12345' })),
    fetchLessonsByReferences: vi.fn(() => Promise.resolve([{ title: 'Lesson 1', description: 'Learn something cool' }])),
    checkUserEnrollment: vi.fn(() => Promise.resolve(false)),
    enrollUserInCourse: vi.fn(() => Promise.resolve(true)),
  }));
  
  describe('CourseDashboard Component', () => {

    test('should render the course title', async () => {
      render(<CourseDetails />);
  
      await waitFor(() => {
        expect(screen.getByText('Sample Course')).toBeInTheDocument();
      });
    });
  
    test('should render the course description', async () => {
      render(<CourseDetails />);
  
      await waitFor(() => {
        expect(screen.getByText('You can find the course details here.')).toBeInTheDocument();
      });
    });
  
    test('should render the enroll button', async () => {
      render(<CourseDetails />);
  
      await waitFor(() => {
        expect(screen.getByText('Enroll')).toBeInTheDocument();
      });
    });
  
    test('should render the course subtitle', async () => {
      render(<CourseDetails />);
  
      await waitFor(() => {
        expect(screen.getByText('A great course')).toBeInTheDocument();
      });
    });
  
    test('should render the course content header', async () => {
      render(<CourseDetails />);
  
      await waitFor(() => {
        expect(screen.getByText('Course content')).toBeInTheDocument();
      });
    });
  
    test('should render the about course section', async () => {
      render(<CourseDetails />);
  
      await waitFor(() => {
        expect(screen.getByText('About course')).toBeInTheDocument();
      });
    });

    test('should click enroll', async () => {
        render(<CourseDetails />);
      
          () => {
          const enrollButton = screen.getByText('Enroll');
          expect(enrollButton).toBeInTheDocument();

           act( () =>  userEvent.click(enrollButton));
        };
      });
  });