import { render, screen } from "@testing-library/react";
import Page from "./page";

// Mock Clerk SignIn component
jest.mock("@clerk/nextjs", () => ({
  SignIn: () => <div data-testid="mock-signin">Mock SignIn Component</div>,
}));

describe("SignIn Page", () => {
  test("renders the heading and subheading", () => {
    render(<Page />);
    expect(screen.getByText("AI Interviewer")).toBeInTheDocument();
    expect(screen.getByText("Your smart mock interview partner")).toBeInTheDocument();
  });

  test("renders the mocked SignIn component", () => {
    render(<Page />);
    expect(screen.getByTestId("mock-signin")).toBeInTheDocument();
  });

  test("has correct outer layout classes", () => {
    render(<Page />);
    // Traverse up to the outermost wrapper
    const outerWrapper = screen.getByTestId("mock-signin").parentElement?.parentElement;
    expect(outerWrapper).toHaveClass("flex", "items-center", "justify-center", "min-h-screen");
  });
});
