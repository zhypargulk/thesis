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
  beforeEach(() => {

    getDocumentById.mockResolvedValue({ courseDocRef: 'ref1' });
    getCourseByRef.mockResolvedValue({ title: 'Test Course', imageUrl: 'url' });
    fetchStudentsInGroup.mockResolvedValue([{ id: 's1', name: 'John Doe' }]);
    getLeaderByRef.mockResolvedValue({ id: 'l1', name: 'Jane Doe' });
  });

  it('renders and fetches data correctly', async () => {
    render(
      <BrowserRouter>
        <ManageGroup />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Group details')).toBeInTheDocument();
      expect(screen.getByText('Test Course course')).toBeInTheDocument();
    });
  });

  it('mounts promotion of leader', async () => {
    addLeaderToGroup.mockResolvedValue();
    render(
      <BrowserRouter>
        <ManageGroup />
      </BrowserRouter>
    );


    expect(screen.getByText('Group details')).toBeInTheDocument();
    expect(screen.getByText('Leader of the group:')).toBeInTheDocument();
    expect(screen.getByText('There is no leader yet. Promote first please!')).toBeInTheDocument();
    expect(screen.getByText('Promote a leader')).toBeInTheDocument();
    expect(screen.getByText('Go to the board')).toBeInTheDocument();
  });

  it('mounts task distribution', async () => {
    addLeaderToGroup.mockResolvedValue();
    render(
      <BrowserRouter>
        <ManageGroup />
      </BrowserRouter>
    );


    expect(screen.getByText('If you are a leader, please distribute tasks among students.')).toBeInTheDocument();
    expect(screen.getByText('Assign tasks:')).toBeInTheDocument();
    expect(screen.getByText('Add New Task')).toBeInTheDocument();

  });

  it('mounts task adding', async () => {

    render(
      <BrowserRouter>
        <ManageGroup />
      </BrowserRouter>
    );

    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    
    await act(async() => await userEvent.click(screen.getByText('Add New Task')));

    await waitFor(() => {
      const buttons = screen.getAllByText('Add New Task');
      expect(buttons.length).toBe(1);
    })

  });

  it('mounts delete and add course', async () => {

    render(
      <BrowserRouter>
        <ManageGroup />
      </BrowserRouter>
    );
    
    await act(async() => await userEvent.click(screen.getByText('Add New Task')));

    await waitFor( async() => {
      const buttons = screen.getAllByText('Add New Task');
      expect(buttons.length).toBe(1);
      const del = screen.getByText('Delete the task');


       await act(async() => await userEvent.click(screen.getByText('Delete the task')));

       await waitFor(() =>  expect(del).not.toBeInTheDocument())
      expect(del).not.toBeInTheDocument();


    

    });




  });
});
