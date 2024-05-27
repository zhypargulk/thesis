import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ChatGroup from './ChatGroup';

vi.mock("../../config/firebase", () => {
    const mockAuth = {
      currentUser: { uid: '12345' }
    };
    const mockDb = {};
    return {
      db: mockDb,
      auth: mockAuth
    };
});

vi.mock("../../controller/Courses", () => ({
    getDocumentById: vi.fn(() => Promise.resolve({
      name: "Test User",
      imageUrl: "http://example.com/avatar.png"
    }))
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom'); 
    return {
      ...actual,
      useParams: () => ({
        groupId: 'group1'
      }),
    };
});

vi.mock("firebase/firestore", () => {
    return {
        collection: vi.fn((db, path) => ({ db, path })),
        query: vi.fn(() => ({})),
        where: vi.fn(() => ({})),
        orderBy: vi.fn(() => ({})),
        onSnapshot: vi.fn((query, callback) => {
            const docs = [
                { id: 'msg1', data: () => ({ text: 'Hello World', createdAt: new Date(), uid: '12345', groupId: 'group1' }) },
                { id: 'msg2', data: () => ({ text: 'Test Message', createdAt: new Date(), uid: '67890', groupId: 'group1' }) }
            ];
            callback({ docs });
            return () => {};
        }),
        addDoc: vi.fn(() => Promise.resolve({ id: 'msg3' })),
        getDoc: vi.fn(docRef => {
            const docData = {
                'user12345': { name: 'Test User', imageUrl: 'http://example.com/image.png' },
                'msg1': { text: 'Hello World', createdAt: new Date(), uid: '12345', groupId: 'group1' },
                'msg2': { text: 'Test Message', createdAt: new Date(), uid: '67890', groupId: 'group1' }
            }[docRef.id];
            return Promise.resolve({
                exists: () => Boolean(docData),
                data: () => docData
            });
        })
    };
});


describe('ChatGroup Component', () => {

  it('scrolls to the bottom when messages update', async () => {
    const mockScrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    render(
      <BrowserRouter>
        <ChatGroup />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockScrollIntoView).toHaveBeenCalled();
    });
  });
});
