import { render, screen, fireEvent } from "@testing-library/react";
import RecordAnswerSection from "./RecordAnswerSection";

// Mocks
jest.mock("react-webcam", () => () => <div data-testid="webcam">Webcam</div>);

const startSpeechToText = jest.fn();
const stopSpeechToText = jest.fn();
const setResults = jest.fn();

jest.mock("react-hook-speech-to-text", () => ({
  __esModule: true,
  default: () => ({
    error: null,
    interimResult: "",
    isRecording: false,
    results: [],
    startSpeechToText,
    stopSpeechToText,
    setResults,
  }),
}));

// ✅ Corrected path: go 5 levels up from current test location
jest.mock("../../../../../../utils/GeminiAIModal", () => ({
  chatSession: {
    sendMessage: jest.fn(() =>
      Promise.resolve({
        response: {
          text: () =>
            Promise.resolve(
              {"rating": 4, "feedback": "Good structure, but try to elaborate more."}
            ),
        },
      })
    ),
  },
}));

jest.mock("../../../../../../utils/db", () => ({
  db: {
    insert: jest.fn(() => ({
      values: jest.fn(() => Promise.resolve(true)),
    })),
  },
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: {
      primaryEmailAddress: { emailAddress: "test@example.com" },
    },
  }),
}));

describe("RecordAnswerSection Component", () => {
  const mockInterviewQuestion = [
    {
      question: "What is React?",
      answer: "A JavaScript library for building UIs.",
    },
  ];

  const interviewData = { mockId: "mock-123" };

  test("renders webcam and button", () => {
    render(
      <RecordAnswerSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={0}
        interviewData={interviewData}
      />
    );

    expect(screen.getByTestId("webcam")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Record Answer/i })).toBeInTheDocument();
  });

  test("starts recording when button is clicked", () => {
    render(
      <RecordAnswerSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={0}
        interviewData={interviewData}
      />
    );

    const button = screen.getByRole("button", { name: /Record Answer/i });
    fireEvent.click(button);
    expect(startSpeechToText).toHaveBeenCalled();
  });
});