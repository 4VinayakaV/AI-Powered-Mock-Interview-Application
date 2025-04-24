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

  test("renders all navigation items", () => {
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    ["DashBoard", "Questions", "Upgrade", "How does it work?"].forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("highlights 'DashBoard' when pathname is /dashboard", () => {
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    expect(screen.getByText("DashBoard")).toHaveClass("text-primary", "font-bold");
  });

  test("highlights 'Questions' when pathname is /dashboard/questions", () => {
    usePathname.mockReturnValue("/dashboard/questions");
    render(<Header />);
    expect(screen.getByText("Questions")).toHaveClass("text-primary", "font-bold");
  });

  test("highlights 'Upgrade' when pathname is /dashboard/upgrade", () => {
    usePathname.mockReturnValue("/dashboard/upgrade");
    render(<Header />);
    expect(screen.getByText("Upgrade")).toHaveClass("text-primary", "font-bold");
  });

  test("highlights 'How does it work?' when pathname is /dashboard/how", () => {
    usePathname.mockReturnValue("/dashboard/how");
    render(<Header />);
    expect(screen.getByText("How does it work?")).toHaveClass("text-primary", "font-bold");
  });

  test("non-active items are not highlighted", () => {
    usePathname.mockReturnValue("/dashboard/questions");
    render(<Header />);
    expect(screen.getByText("DashBoard")).not.toHaveClass("text-primary", "font-bold");
    expect(screen.getByText("Upgrade")).not.toHaveClass("text-primary", "font-bold");
  });

  test("navigation list is hidden on small screens (via class)", () => {
    usePathname.mockReturnValue("/dashboard");
    render(<Header />);
    const navList = screen.getByText("DashBoard").closest("ul");
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
    const wrapper = screen.getByText("DashBoard").closest("div");
    expect(wrapper).toHaveClass("flex", "bg-white", "shadow-md", "border-b");
  });

  test("component does not crash on unknown path", () => {
    usePathname.mockReturnValue("/random/path");
    render(<Header />);
    expect(screen.getByText("DashBoard")).toBeInTheDocument();
  });

  test("component renders without any error", () => {
    usePathname.mockReturnValue("/dashboard");
    expect(() => render(<Header />)).not.toThrow();
  });
});
