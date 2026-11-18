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
    expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
  });

  it("switches to signup form", async () => {
    renderAuth("/auth");
    await userEvent.click(screen.getByRole("link", { name: /sign up/i }));
    expect(
      screen.getByRole("heading", { name: /create your account/i })
    ).toBeInTheDocument();
  });
});