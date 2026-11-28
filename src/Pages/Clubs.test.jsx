import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Clubs from "./Clubs.jsx";
import { getClubs } from "../services/clubsApi";

vi.mock("../services/clubsApi", () => ({ getClubs: vi.fn() }));

const clubs = [
  { id: 1, name: "Tech Society", university: "Strathmore University", description: "Hackathons.", contactEmail: null, logoUrl: null },
  { id: 2, name: "Music Society", university: "University of Nairobi", description: "Concerts.", contactEmail: null, logoUrl: null },
];

function renderClubs() {
  return render(
    <MemoryRouter>
      <Clubs />
    </MemoryRouter>
  );
}

describe("Clubs page", () => {
  beforeEach(() => vi.resetAllMocks());

  it("lists clubs and filters by university", async () => {
    getClubs.mockResolvedValue(clubs);
    renderClubs();

    expect(await screen.findByRole("link", { name: "Tech Society" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Music Society" })).toBeInTheDocument();

    await userEvent.selectOptions(
      screen.getByLabelText("University"),
      "Strathmore University"
    );

    expect(screen.getByRole("link", { name: "Tech Society" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Music Society" })).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no clubs", async () => {
    getClubs.mockResolvedValue([]);
    renderClubs();

    expect(await screen.findByText("No clubs found.")).toBeInTheDocument();
  });

  it("shows an error with a retry button", async () => {
    getClubs.mockRejectedValue(Object.assign(new Error("Network error"), { status: 0 }));
    renderClubs();

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
