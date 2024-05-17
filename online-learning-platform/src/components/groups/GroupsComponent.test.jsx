import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import GroupsComponent from './GroupsComponent';
import { fetchStudentCoursesAndGroups } from '../../controller/Groups';


vi.mock('../../controller/Groups', () => ({
  fetchStudentCoursesAndGroups: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('GroupsComponent', () => {
  it('should render and display initial UI elements', async () => {

    fetchStudentCoursesAndGroups.mockResolvedValue([]);
    render(
      <BrowserRouter>
        <GroupsComponent />
      </BrowserRouter>
    );

    expect(screen.getByText('Your groups')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Find the course')).toBeInTheDocument();
  });
});
