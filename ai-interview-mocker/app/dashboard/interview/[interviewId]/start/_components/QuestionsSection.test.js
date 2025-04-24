import { render, screen } from "@testing-library/react";
import QuestionsSection from "./QuestionsSection";
import { Lightbulb } from "lucide-react";

// Sample mock data
const mockInterviewQuestion = [
  { question: "What is React?", answer: "A JavaScript library." },
  { question: "What is useState?", answer: "A React Hook." },
  { question: "What is JSX?", answer: "JavaScript XML syntax." },
];

describe("QuestionsSection Component", () => {
  test("renders without crashing", () => {
    render(
      <QuestionsSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={0}
      />
    );

    expect(screen.getByText("Question #1")).toBeInTheDocument();
  });

  test("renders all question buttons", () => {
    render(
      <QuestionsSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={0}
      />
    );

    mockInterviewQuestion.forEach((_, index) => {
      expect(screen.getByText(`Question #${index + 1}`)).toBeInTheDocument();
    });
  });

  test("highlights the active question", () => {
    render(
      <QuestionsSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={1}
      />
    );

    const active = screen.getByText("Question #2");
    expect(active).toHaveClass("bg-primary", "text-white");
  });

  test("displays the active question text", () => {
    render(
      <QuestionsSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={2}
      />
    );

    expect(screen.getByText("What is JSX?")).toBeInTheDocument();
  });

  test("renders the lightbulb note section", () => {
    render(
      <QuestionsSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={0}
      />
    );

    expect(screen.getByText("Note:")).toBeInTheDocument();
    expect(
      screen.getByText(/Click on Record Answer when you want to answer the question/i)
    ).toBeInTheDocument();
  });
});
