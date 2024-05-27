import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from '@testing-library/user-event';
import LogIn from './LogIn';

const setup = (ui, { route = '/login' } = {}) => {
  render(
    <RouterProvider router={createMemoryRouter([{ path: route, element: ui }], { initialEntries: [route] })} />
  );
};

describe('LogIn Component', () => {
  test('mount button and header', async () => {
    setup(<LogIn />);

    const button = await screen.findByRole('button', { name: 'Sign in' });
    const title = await screen.findByText('Welcome Back!');

    expect(button).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  test('check input fields presence and interaction', async () => {
    setup(<LogIn />);

    const emailInput = await screen.findByPlaceholderText('Email');
    const passwordInput = await screen.findByPlaceholderText('Password');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    await userEvent.type(emailInput, 'test@mail.ru');
    await userEvent.type(passwordInput, 'testpsw12345678');

    expect(emailInput.value).toBe('test@mail.ru');
    expect(passwordInput.value).toBe('testpsw12345678');
  });
});
