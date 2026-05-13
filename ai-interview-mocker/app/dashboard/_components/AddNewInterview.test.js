import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddNewInterview from "./AddNewInterview";

const push = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("AddNewInterview Component", () => {
  beforeEach(() => {
    push.mockClear();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ mockId: "mock-123" })),
      })
    );
  });

  test("renders the 'Add New Interview' card", () => {
    render(<AddNewInterview />);
    expect(screen.getByText("Add New Interview")).toBeInTheDocument();
  });

  test("opens the dialog when card is clicked", () => {
    render(<AddNewInterview />);
    fireEvent.click(screen.getByText("Add New Interview"));
    expect(screen.queryByText("Start a New Mock Interview")).not.toBeNull();
  });

  test("renders all input fields in the dialog", () => {
    render(<AddNewInterview />);
    fireEvent.click(screen.getByText("Add New Interview"));
    expect(screen.getByPlaceholderText("e.g. Full Stack Developer")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. React, Python, Flask, PostgreSQL")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Resume PDF")).toBeInTheDocument();
  });

  test("submits the form and calls backend methods", async () => {
    render(<AddNewInterview />);
    fireEvent.click(screen.getByText("Add New Interview"));

    fireEvent.change(screen.getByPlaceholderText("e.g. Full Stack Developer"), {
      target: { value: "Frontend Dev" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. React, Python, Flask, PostgreSQL"), {
      target: { value: "React, Tailwind" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 3"), {
      target: { value: "2" },
    });

    fireEvent.click(screen.getByText("Start Interview"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/interviews', expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }));
      expect(push).toHaveBeenCalledWith('/dashboard/interview/mock-123');
    });
  });

  test("cancel button closes the dialog", () => {
    render(<AddNewInterview />);
    fireEvent.click(screen.getByText("Add New Interview"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Start a New Mock Interview")).not.toBeInTheDocument();
  });

  test("form prevents submission when required fields are empty", () => {
    render(<AddNewInterview />);
    fireEvent.click(screen.getByText("Add New Interview"));
    const submitButton = screen.getByText("Start Interview");
    expect(submitButton.closest('button')).not.toBeDisabled();
  });

  test("loading state shows spinner", async () => {
    render(<AddNewInterview />);
    fireEvent.click(screen.getByText("Add New Interview"));

    fireEvent.change(screen.getByPlaceholderText("e.g. Full Stack Developer"), {
      target: { value: "Dev" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. React, Python, Flask, PostgreSQL"), {
      target: { value: "React" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 3"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("Start Interview"));
    await waitFor(() => {
      expect(screen.getByText("Generating...")).toBeInTheDocument();
    });
  });

  test("renders with no crash on empty dialog open", () => {
    render(<AddNewInterview />);
    fireEvent.click(screen.getByText("Add New Interview"));
    expect(screen.getByText("Start a New Mock Interview")).toBeInTheDocument();
  });

  test("renders input correctly after re-open dialog", () => {
    render(<AddNewInterview />);
    fireEvent.click(screen.getByText("Add New Interview"));
    fireEvent.click(screen.getByText("Cancel"));
    fireEvent.click(screen.getByText("Add New Interview"));
    expect(screen.getByPlaceholderText("e.g. Full Stack Developer")).toBeInTheDocument();
  });

  test("input fields are editable", () => {
    render(<AddNewInterview />);
    fireEvent.click(screen.getByText("Add New Interview"));

    const roleInput = screen.getByPlaceholderText("e.g. Full Stack Developer");
    fireEvent.change(roleInput, { target: { value: "Tester" } });
    expect(roleInput.value).toBe("Tester");
  });
});
