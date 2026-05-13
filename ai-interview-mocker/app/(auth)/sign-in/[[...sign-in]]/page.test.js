import { render, screen } from "@testing-library/react";
import Page from "./page";

// Mock Clerk SignIn component
jest.mock("@clerk/nextjs", () => ({
  SignIn: () => <div data-testid="mock-signin">Mock SignIn Component</div>,
}));

describe("SignIn Page", () => {
  test("renders the branded sign-in content", () => {
    render(<Page />);
    expect(screen.getByText("AI Interviewer")).toBeInTheDocument();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to continue to your interview dashboard.")).toBeInTheDocument();
  });

  test("renders the mocked SignIn component", () => {
    render(<Page />);
    expect(screen.getByTestId("mock-signin")).toBeInTheDocument();
  });
});
