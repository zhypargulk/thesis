// setupTests.js
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mocks for React Router
// vi.mock("react-router-dom", () => ({
//   ...vi.requireActual("react-router-dom"),
//   useNavigate: () => vi.fn(),
//   useLocation: () => ({ pathname: "/mock-path" }),
// }));

// Mocks for Firebase
// jest.mock("./src/config/firebase", () => ({
//   auth: {
//     onAuthStateChanged: jest.fn((callback) => {
//       callback({ displayName: "User-Teacher" });
//       return jest.fn(); // Mock the unsubscribe function
//     }),
//   },
// }));

// vi.mock("firebase/auth", () => ({
//   signOut: vi.fn(() => Promise.resolve()), // Mock signOut to always succeed
// }));
