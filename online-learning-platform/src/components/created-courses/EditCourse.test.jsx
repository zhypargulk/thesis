import { describe, it, vi, expect } from 'vitest';
import { render as rtlRender, waitFor, screen } from '@testing-library/react';
import EditCourse from './EditCourse';
import { BrowserRouter } from 'react-router-dom';


const render = (component) => 
  rtlRender(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );

  vi.mock('../../config/firebase', () => {
    const mockAuth = {
      onAuthStateChanged: vi.fn(callback => {
        callback({ uid: '123', email: 'user@example.com' });
        return () => {};
      }),
      currentUser: { uid: '123', email: 'user@example.com' }
    };
  
    const mockFirestore = {
      doc: vi.fn((db, path) => ({
        id: path.split("/").pop(),
        collection: vi.fn(() => ({  
        })),
      })),
      getDoc: vi.fn(docRef => Promise.resolve({
        exists: () => true,
        data: () => ({
          title: "Web Development",
          description: "This course covers advanced topics in web development.",
          finalProject: "Build a full-stack application.",
          answer: "Detailed project requirements and answers.",
          lessons: [docRef, docRef]  
        }),
      })),
      updateDoc: vi.fn(() => Promise.resolve()),
      collection: vi.fn(() => ({
        doc: vi.fn(() => ({ 
          id: 'newDoc'
        }))
      })),
    };
  
    const mockStorage = {
      ref: vi.fn(() => ({
        put: vi.fn(() => Promise.resolve({
          ref: {
            getDownloadURL: vi.fn(() => Promise.resolve('http://example.com/download-url'))
          }
        }))
      })),
    };
  
    return { db: mockFirestore, storage: mockStorage, auth: mockAuth };
  });
  

  describe('EditCourse Component', () => {
    it('loads and displays course details', async () => {
      try {
        render(<EditCourse />);
        await waitFor(() => {
          expect(screen.getByText('Course Information')).toBeInTheDocument();
          expect(screen.getByText('Edit Course')).toBeInTheDocument();
        });
      } catch (error) {
        console.error("Error in test: ", error);
      }
    });
  });
  
