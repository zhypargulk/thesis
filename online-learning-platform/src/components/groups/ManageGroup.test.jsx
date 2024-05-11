import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import ManageGroup from './ManageGroup';
import * as GroupController from '../../controller/Groups';
import * as TaskController from '../../controller/Tasks';
import * as AuthContext from '../../context/AuthContext';
import { userEvent } from '@testing-library/user-event';


vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ uid: 'user1' })),
}));

vi.mock('../../controller/Groups', () => ({
  addLeaderToGroup: vi.fn(),
  getCourseByRef: vi.fn(),
  fetchStudentsInGroup: vi.fn(),
  getLeaderByRef: vi.fn(),
  getDocumentById: vi.fn(),
}));

vi.mock('../../controller/Tasks', () => ({
  createTask: vi.fn(),
  getAllTasks: vi.fn(),
}));

describe('ManageGroup Component', () => {
  beforeEach(() => {
    // Set up any default mock implementations
    GroupController.getDocumentById.mockResolvedValue({ courseDocRef: 'ref1' });
    GroupController.getCourseByRef.mockResolvedValue({ title: 'Test Course', imageUrl: 'url' });
    GroupController.fetchStudentsInGroup.mockResolvedValue([{ id: 's1', name: 'John Doe' }]);
    GroupController.getLeaderByRef.mockResolvedValue({ id: 'l1', name: 'Jane Doe' });
  });

  it('renders and fetches data correctly', async () => {
    render(
      <BrowserRouter>
        <ManageGroup />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Group details')).toBeInTheDocument();
      expect(screen.getByText('course')).toBeInTheDocument();
    });
  });

  it('handles leader promotion', async () => {
    const mockPromoteLeader = GroupController.addLeaderToGroup.mockResolvedValue();
    render(
      <BrowserRouter>
        <ManageGroup />
      </BrowserRouter>
    );

    const leaderButton = screen.getByText('Promote Leader');
    userEvent.click(leaderButton);

    await waitFor(() => {
    });
  });

});
