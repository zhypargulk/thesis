// setupTests.js
import "@testing-library/jest-dom";

// Mocks for React Router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/mock-path" }),
}));

// Mocks for Firebase
// jest.mock("./src/config/firebase", () => ({
//   auth: {
//     onAuthStateChanged: jest.fn((callback) => {
//       callback({ displayName: "User-Teacher" });
//       return jest.fn(); // Mock the unsubscribe function
//     }),
//   },
// }));

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(() => Promise.resolve()), // Mock signOut to always succeed
}));
