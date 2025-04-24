import { render, screen, waitFor } from "@testing-library/react";
import InterviewList from "./InterviewList";

// Mock InterviewItemCard component
jest.mock("./InterviewItemCard", () => ({
  __esModule: true,
  default: ({ interview }) => (
    <div data-testid="mock-interview-card">{interview.jobPosition}</div>
  ),
}));

// Mock Clerk useUser
jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: {
      primaryEmailAddress: { emailAddress: "test@example.com" },
    },
  }),
}));

// Dynamically mocked DB response
const mockData = [
  { id: 1, jobPosition: "Frontend Developer" },
  { id: 2, jobPosition: "Backend Developer" },
  { id: 3, jobPosition: "Full Stack Developer" }, // Add as many as you'd like
];

jest.mock("../../../utils/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          orderBy: () => Promise.resolve(mockData),
        }),
      }),
    }),
  },
}));

jest.mock("../../../utils/schema", () => ({
  MockInterview: {
    createdBy: "createdBy",
    id: "id",
  },
}));

describe("InterviewList Component", () => {
  test("renders heading", () => {
    render(<InterviewList />);
    expect(
      screen.getByText("Previous Mock Interviews")
    ).toBeInTheDocument();
  });

  test("renders all fetched interview cards", async () => {
    render(<InterviewList />);
    await waitFor(() => {
      const cards = screen.getAllByTestId("mock-interview-card");
      expect(cards.length).toBeGreaterThan(0); // ✅ Flexible length
      mockData.forEach(({ jobPosition }) => {
        expect(screen.getByText(jobPosition)).toBeInTheDocument();
      });
    });
  });
});
