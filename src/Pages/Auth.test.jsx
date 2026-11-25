import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Auth from "./Auth.jsx";

function renderAuth(url = "/auth") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Auth />
    </MemoryRouter>
  );
}

describe("Auth page", () => {
  it("shows the login form by default", () => {
    renderAuth("/auth");
    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("switches to signup form", async () => {
    renderAuth("/auth");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(
      screen.getByRole("heading", { name: /create account/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it("opens the signup form from /auth?mode=signup", () => {
    renderAuth("/auth?mode=signup");
    expect(
      screen.getByRole("heading", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("switches back to login", async () => {
    renderAuth("/auth?mode=signup");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));
    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();
  });
});