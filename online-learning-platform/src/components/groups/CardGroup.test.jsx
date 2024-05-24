import React from 'react';
import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import CardGroup from './CardGroup';
import { fetchStudentsInGroup, getLeaderByRef } from '../../controller/Groups';
import { getDocumentById } from "../../controller/Courses";

vi.mock('../../controller/Groups', () => ({
  fetchStudentsInGroup: vi.fn(),
  getLeaderByRef: vi.fn()
}));

vi.mock('../../controller/Courses', () => ({
  getDocumentById: vi.fn(),
}));

const render = (component) => 
  rtlRender(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
  describe('CardGroup Component', () => {
    const groupId = "group1";
    const mockStudents = [{ name: 'Alice' }, { name: 'Bob' }];
    const mockLeader = { name: 'Alice' };
    const mockGroupData = { leaderGroup: 'leaderRef' };
  
    beforeEach(() => {
      fetchStudentsInGroup.mockResolvedValue(mockStudents);
      getDocumentById.mockResolvedValue(mockGroupData);
    });
  
    test('renders and fetches data correctly', async () => {
      render(
          <CardGroup title="Software Development" imageUrl="http://example.com/image.png" groupId={groupId} />
      );

      expect(screen.getByText('Software Development group project')).toBeInTheDocument();

    });

    test('mount and check members', async () => {
      render(
          <CardGroup title="Software Development" imageUrl="http://example.com/image.png" groupId={groupId} />
      );

      expect(screen.getByText(/All members of group:/)).toBeInTheDocument();
    });

    test('mount and check leader', async () => {
      render(
          <CardGroup title="Software Development" imageUrl="http://example.com/image.png" groupId={groupId} />
      );

      expect(screen.getByText('Leader:')).toBeInTheDocument();
      expect(screen.getByText('No leader')).toBeInTheDocument();
    });
  
  
  
    test('handles no leader correctly', async () => {
      getLeaderByRef.mockResolvedValueOnce(null); 
  
      render(
          <CardGroup title="Software Development" imageUrl="http://example.com/image.png" groupId={groupId} />
      );
  
      await waitFor(() => {
        expect(screen.getByText('No leader')).toBeInTheDocument();
      });
    });
  
    test('displays an error if data fetching fails', async () => {
      console.error = vi.fn(); 
      fetchStudentsInGroup.mockRejectedValueOnce(new Error('Failed to fetch'));
  
      render(
          <CardGroup title="Software Development" imageUrl="http://example.com/image.png" groupId={groupId} />
      );
  
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Failed to fetch students or group:', expect.any(Error));
      });
    });
  });