import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import ManageGroup from './ManageGroup';
import {
  addLeaderToGroup,
  getCourseByRef,
  fetchStudentsInGroup,
  getLeaderByRef,
} from "../../controller/Groups";
import { getDocumentById } from "../../controller/Courses";
import { createTask, getAllTasks } from "../../controller/Tasks";
import { useAuth } from "../../context/AuthContext";

import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

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

vi.mock('../../controller/Courses', () => ({
  getDocumentById: vi.fn(),
}));

vi.mock('../../controller/Tasks', () => ({
  createTask: vi.fn(),
  getAllTasks: vi.fn(),
}));

describe('ManageGroup Component', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    getDocumentById.mockResolvedValue({ courseDocRef: 'ref1' });
    getCourseByRef.mockResolvedValue({ title: 'Test Course', imageUrl: 'url' });
    fetchStudentsInGroup.mockResolvedValue([{ id: 's1', name: 'John Doe' }]);
    getLeaderByRef.mockResolvedValue({ id: 'l1', name: 'Jane Doe' });

    await act(async () => {
      render(
        <BrowserRouter>
          <ManageGroup />
        </BrowserRouter>
      );
    });
  });

  it('renders and fetches data correctly', async () => {
    await waitFor(() => {
      expect(screen.getByText('Group details')).toBeInTheDocument();
      expect(screen.getByText('Test Course course')).toBeInTheDocument();
    });
  });

  it('mounts promotion of leader', async () => {
    expect(screen.getByText('Leader of the group:')).toBeInTheDocument();
  });

  it('mounts group details', async () => {
    expect(screen.getByText('There is no leader yet. Promote first please!')).toBeInTheDocument();
    expect(screen.getByText('Promote a leader')).toBeInTheDocument();
    expect(screen.getByText('Go to the board')).toBeInTheDocument();
  });

  it('mounts task title', async () => {
    expect(screen.getByText('If you are a leader, please distribute tasks among students.')).toBeInTheDocument();
  });

  it('mounts task distribution', async () => {
    expect(screen.getByText('Assign tasks:')).toBeInTheDocument();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();
  });

  it('mounts task adding', async () => {
    await act(async () => {
      await userEvent.click(screen.getByText('Add New Task'));
    });

    await waitFor(() => {
      const buttons = screen.getAllByText('Add New Task');
      expect(buttons.length).toBeGreaterThanOrEqual(1); 
    });
  });

  it('mounts delete and add course', async () => {
    await act(async () => {
      await userEvent.click(screen.getByText('Add New Task'));
    });

    await waitFor(() => {
      const delButton = screen.getAllByText('Delete the task');
      expect(delButton[0]).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(screen.getAllByText('Delete the task')[0]);
    });


    await waitFor(() => {
      expect(screen.queryByText('Delete the task')).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(screen.getByText('Delete the task'));
    });

    await waitFor(() => {
      expect(screen.queryByText('Delete the task')).not.toBeInTheDocument();
    });
  });
});
