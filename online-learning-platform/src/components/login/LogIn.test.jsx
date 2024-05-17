import { render as rtlRender, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom"; // ensure path accuracy
import { act } from "@testing-library/react";
import { expect } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import LogIn from './LogIn';

const render = (initialEntry = "/login") =>
  rtlRender(
    <RouterProvider router={createMemoryRouter([{ path: initialEntry, element: <LogIn /> }], { initialEntries: [initialEntry] })} />
  );

describe('LogIn Component', () => {


  test('mount button and header', async() => {
    render('/login');
    const button = screen.getByText('Sign in');
    const title = screen.getByText('Welcome Back!');
    expect(button).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  test('sign in user', async() => {
    render('/login');


    const button = screen.getByText('Sign in');
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();

    act(() => {
        userEvent.type(email, 'test');
        userEvent.click(button);
    })

    expect(await screen.findByText('Password is required')).toBeInTheDocument()

    await act(async() => {
        await userEvent.clear(email);

    });

    await act(async() => {
        await userEvent.type(email, 'test@mail.ru');
    });

    await act(async() => {
        await userEvent.type(password, 'testpsw12345678');
    });

    await act(async() => {
        await userEvent.click(button);
    });

  });
});
