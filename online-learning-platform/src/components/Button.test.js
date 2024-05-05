import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Button } from "primereact/button";
import { act } from "@testing-library/react";

// Mocking a specific CSS file
jest.mock("./Button.css", () => {});

test("renders a button with the label", () => {
  render(<Button label="Click me" />);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});

test("renders a button with the label", async () => {
  render(<Button label="Click me" />);

  await act(() => userEvent.click(screen.getByText("Click me")));
  expect(screen.getByText("Click me")).toBeInTheDocument();
});
