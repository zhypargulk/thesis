import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OnlineIDE from './OnlineIDE';
import { userEvent } from '@testing-library/user-event';
import { act } from '@testing-library/react';

// // Mock axios
// vi.mock('axios', () => ({
//   post: vi.fn(() => Promise.resolve({ data: { data: 'Mocked response', error: '' } })),
// }));

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

// You may need to mock additional dependencies if there are any

describe('OnlineIDE Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('mount the ide', async () => {
    render(
      <BrowserRouter>
        <OnlineIDE />
      </BrowserRouter>
    );

    const textArea = screen.getByTestId('textArea');
    expect(textArea).toBeInTheDocument();
    });

    test('type into ide', async () => {
        render(
          <BrowserRouter>
            <OnlineIDE />
          </BrowserRouter>
        );

        const textArea = screen.getByTestId('textArea');
        expect(textArea).toBeInTheDocument();
    
    
        userEvent.type(textArea,  'print("hello world")');
        await waitFor(() => expect(screen.getByText('print("hello world")')).toBeInTheDocument())
        
        const runButton = screen.getByRole('button', { name: 'Run Code' });
        await act(async() => {
            await userEvent.click(runButton);
        })
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
            screen.debug(undefined, 9999999)
          expect(screen.getAllByText('Python')[0]).toBeInTheDocument();
        });

        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('Java')).toBeInTheDocument();
        expect(screen.getByText('C++')).toBeInTheDocument();
      });

});
