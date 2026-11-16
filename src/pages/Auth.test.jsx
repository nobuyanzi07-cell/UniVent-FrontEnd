import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Auth from "./Auth";

describe("Auth page", () => {
  it("shows the login form by default", () => {
    render(<Auth />);

    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();
  });

  it("switches to signup form", () => {
    render(<Auth />);

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(
      screen.getByRole("heading", { name: /create account/i })
    ).toBeInTheDocument();
  });
});