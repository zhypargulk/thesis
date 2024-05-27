import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Auth from './Register';

const setup = (ui, { route = '/register' } = {}) => {
  render(
    <RouterProvider router={createMemoryRouter([{ path: route, element: ui }], { initialEntries: [route] })} />
  );
};

describe('Auth Component', () => {
  test('renders registration form with all fields', async () => {
    setup(<Auth />);
    await waitFor(() => expect(screen.getByText('Register the User')).toBeInTheDocument());
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument();
    expect(screen.getByTestId('SubmitButton')).toBeInTheDocument();
    expect(screen.getByTestId('dropdownID')).toBeInTheDocument();
    expect(screen.getByTestId('SubmitButton')).toBeDisabled();
  });

  test('displays error when trying to submit with invalid email', async () => {
    setup(<Auth />);

    await userEvent.type(screen.getByPlaceholderText('Your full name'), 'John Doe');
    await userEvent.type(screen.getByPlaceholderText('Your email address'), 'john.doe@mail.ru');
    await userEvent.type(screen.getByPlaceholderText('Your password'), 'password123');
    await userEvent.click(screen.getByTestId('dropdownID'));
    await userEvent.click(screen.getByText('Teacher'));
    await userEvent.click(screen.getByText('Create account'));

    await waitFor(() => {
      expect(screen.getByTestId('SubmitButton')).not.toBeDisabled();
    });

  });
});
