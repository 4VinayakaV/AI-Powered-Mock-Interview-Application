import { render, screen } from "@testing-library/react";
import Header from "./Header";

// Mock usePathname from next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock Clerk's UserButton
jest.mock("@clerk/nextjs", () => ({
  UserButton: () => <div>UserButton</div>,
}));

describe("Header component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders logo with correct alt text", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  test("logo uses Image component with correct dimensions", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    const logo = screen.getByAltText("logo");
    expect(logo).toHaveAttribute("width", "50");
    expect(logo).toHaveAttribute("height", "50");
  });

  test("renders all navigation items", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    ["DashBoard", "Questions", "Upgarde", "How does it work?"].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("highlights 'DashBoard' when pathname is /dashboard", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    expect(screen.getByText("DashBoard")).toHaveClass("text-primary", "font-bold");
  });

  test("highlights 'Questions' when pathname is /dashboard/questions", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard/questions");
    render(<Header />);
    expect(screen.getByText("Questions")).toHaveClass("text-primary", "font-bold");
  });

  test("highlights 'Upgarde' when pathname is /dashboard/upgrade", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard/upgrade");
    render(<Header />);
    expect(screen.getByText("Upgarde")).toHaveClass("text-primary", "font-bold");
  });

  test("highlights 'How does it work?' when pathname is /dashboard/how", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard/how");
    render(<Header />);
    expect(screen.getByText("How does it work?")).toHaveClass("text-primary", "font-bold");
  });

  test("non-active items are not highlighted", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard/questions");
    render(<Header />);
    expect(screen.getByText("DashBoard")).not.toHaveClass("text-primary", "font-bold");
    expect(screen.getByText("Upgarde")).not.toHaveClass("text-primary", "font-bold");
  });

  test("navigation list is hidden on small screens (via class)", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    const ul = screen.getByRole("list");
    expect(ul).toHaveClass("hidden", "md:flex");
  });

  test("renders the Clerk UserButton", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    expect(screen.getByText("UserButton")).toBeInTheDocument();
  });

  test("wrapper div uses flex and bg-secondary classes", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    const wrapper = screen.getByText("DashBoard").closest("div");

    expect(wrapper).toHaveClass("flex", "bg-secondary", "shadow-md");
  });

  test("component does not crash on unexpected pathname", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/some/unknown/path");
    render(<Header />);
    expect(screen.getByText("DashBoard")).toBeInTheDocument(); // It still renders safely
  });

  test("component renders without errors", () => {
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard");
    expect(() => render(<Header />)).not.toThrow();
  });
});
