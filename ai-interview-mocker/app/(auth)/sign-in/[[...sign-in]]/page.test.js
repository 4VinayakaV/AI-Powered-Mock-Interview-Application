import { render, screen } from "@testing-library/react";
import Page from "./page"; 
import { SignIn } from "@clerk/nextjs";

jest.mock("@clerk/nextjs", () => ({
  SignIn: () => <div data-testid="mock-signin">Mock SignIn Component</div>,
}));

test("renders the SignIn component", () => {
  render(<Page />);

  // Check if the mocked SignIn component is rendered
  expect(screen.getByTestId("mock-signin")).toBeInTheDocument();
});
