import Home from "../app/page";

const redirect = jest.fn();

jest.mock("next/navigation", () => ({
  redirect: (...args) => redirect(...args),
}));

test("redirects Home page to dashboard", () => {
  Home();
  expect(redirect).toHaveBeenCalledWith("/dashboard");
});
