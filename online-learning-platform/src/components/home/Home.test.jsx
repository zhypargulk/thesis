// import React from 'react';
import { render as rtlRender, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { auth } from "../../config/firebase"; // ensure path accuracy
import { act } from "@testing-library/react";
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import Home from './Home';

const render = (component, container) => {
    return rtlRender(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>,
      container
    );
  };

vi.mock('../../config/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn()
  }
}));

const mockNavigate = vi.fn()



vi.mock('react-router-dom', async () => {
  const client = await vi.importActual('react-router-dom');
  const res = {
    ...(client ),
    useNavigate: () => mockNavigate,
  };

  return res;
});

describe('MenubarCustom Component', () => {
  test('renders the teacher menu items when user is a teacher', () => {
   render(<Home/>);
  });



});
