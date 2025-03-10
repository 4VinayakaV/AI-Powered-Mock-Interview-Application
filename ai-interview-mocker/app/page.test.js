import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import { Button } from "@/components/ui/button";

jest.mock("@/components/ui/button", () => ({
  Button: ({ children }) => <button>{children}</button>,
}));

test("renders Home page with heading and button", () => {
  render(<Home />);

  // Check if the heading "Test Page" appears
  expect(screen.getByText("Test Page")).toBeInTheDocument();

  // Check if the Button with text "Click" is rendered
  expect(screen.getByText("Click")).toBeInTheDocument();
});
