import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OnlineIDE from './OnlineIDE';
import userEvent from '@testing-library/user-event';
import { getAllTasks, updateGroupTaskStatus } from "../../controller/Tasks";
import { updateGroupAnswer, getCourseByRef, getDocumentById } from "../../controller/Groups";

// Mock CodeMirror as a simple textarea for simplicity
vi.mock('@uiw/react-codemirror', () => ({
  __esModule: true,
  default: ({ onChange, value, extensions, theme }) => (
    <textarea
      onChange={(e) => onChange(e.target.value)}
      value={value}
      data-theme={theme}
      data-extensions={extensions}
      data-testid='textArea'
    />
  ),
}));

// Mock functions from Tasks and Groups controllers
vi.mock('../../controller/Tasks', () => ({
  getAllTasks: vi.fn(),
  updateGroupTaskStatus: vi.fn(),
}));

vi.mock('../../controller/Groups', () => ({
  updateGroupAnswer: vi.fn(),
  getCourseByRef: vi.fn(),
  getDocumentById: vi.fn(),
}));

describe('OnlineIDE Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Set up default mock implementations
    getDocumentById.mockResolvedValue({ courseDocRef: 'ref1' });
    getCourseByRef.mockResolvedValue({ title: 'Test Course', answer: 'Expected Output' });
    getAllTasks.mockResolvedValue([
      { title: 'Task 1', code: 'print("hello world")', courseRef: 'ref1' },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('mount the IDE', async () => {
    render(
      <BrowserRouter>
        <OnlineIDE />
      </BrowserRouter>
    );

    const textArea = screen.getByTestId('textArea');
    expect(textArea).toBeInTheDocument();
  });

  test('type into IDE', async () => {
    render(
      <BrowserRouter>
        <OnlineIDE />
      </BrowserRouter>
    );

    const textArea = screen.getByTestId('textArea');
    expect(textArea).toBeInTheDocument();

    userEvent.type(textArea, 'print("hello world")');
    await waitFor(() => expect(textArea.value).toBe('print("hello world")'));

    const runButton = screen.getByRole('button', { name: 'Run Code' });
    await act(async () => {
      await userEvent.click(runButton);
    });
  });

  test('mount the button back to the board', async () => {
    render(
      <BrowserRouter>
        <OnlineIDE />
      </BrowserRouter>
    );

    const button = screen.getByText('Back to the board');
    expect(button).toBeInTheDocument();
  });

  test('dropdown mount', async () => {
    render(
      <BrowserRouter>
        <OnlineIDE />
      </BrowserRouter>
    );

    const dropdown = screen.getByTestId('dropdownTest');
    expect(dropdown).toBeInTheDocument();

    await userEvent.click(dropdown);

    await waitFor(() => {
      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('C++')).toBeInTheDocument();
  });
});
