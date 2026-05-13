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
  const { usePathname } = require("next/navigation");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders logo with correct alt text", () => {
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    expect(screen.getByAltText("logo")).toBeInTheDocument();
  });

  test("logo uses Image component with correct dimensions", () => {
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    const logo = screen.getByAltText("logo");
    expect(logo).toHaveAttribute("width", "42");
    expect(logo).toHaveAttribute("height", "42");
  });

  test("renders only active navigation items", () => {
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Questions")).not.toBeInTheDocument();
    expect(screen.queryByText("Upgrade")).not.toBeInTheDocument();
    expect(screen.queryByText("How does it work?")).not.toBeInTheDocument();
  });

  test("highlights 'Dashboard' when pathname is /dashboard", () => {
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    expect(screen.getByText("Dashboard")).toHaveClass("bg-teal-50", "text-teal-700");
  });

  test("non-active items are not highlighted", () => {
    usePathname.mockReturnValue("/random/path");
    render(<Header />);
    expect(screen.getByText("Dashboard")).not.toHaveClass("bg-teal-50", "text-teal-700");
  });

  test("navigation list is hidden on small screens (via class)", () => {
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    const navList = screen.getByText("Dashboard").closest("ul");
    expect(navList).toHaveClass("hidden", "md:flex");
  });

  test("renders the Clerk UserButton", () => {
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    expect(screen.getByText("UserButton")).toBeInTheDocument();
  });

  test("wrapper div uses correct layout and theme classes", () => {
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    const wrapper = screen.getByText("Dashboard").closest("div");
    expect(wrapper).toHaveClass("flex", "bg-white/95", "shadow-sm", "border-b");
  });

  test("component does not crash on unknown path", () => {
    usePathname.mockReturnValue("/random/path");
    render(<Header />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("component renders without any error", () => {
    usePathname.mockReturnValue("/dashboard");
    expect(() => render(<Header />)).not.toThrow();
  });
});
