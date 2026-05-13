import { render, screen, waitFor } from "@testing-library/react";
import InterviewList from "./InterviewList";

// Mock InterviewItemCard component
jest.mock("./InterviewItemCard", () => ({
  __esModule: true,
  default: ({ interview }) => (
    <div data-testid="mock-interview-card">{interview.jobPosition}</div>
  ),
}));

const mockData = [
  { id: 1, mockId: "mock-1", jobPosition: "Frontend Developer" },
  { id: 2, mockId: "mock-2", jobPosition: "Backend Developer" },
  { id: 3, mockId: "mock-3", jobPosition: "Full Stack Developer" },
];

describe("InterviewList Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ interviews: mockData })),
      })
    );
  });

  test("renders heading", async () => {
    render(<InterviewList />);
    expect(
      screen.getByText("Previous Mock Interviews")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });
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
