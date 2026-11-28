import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClubDetails from "./ClubDetails.jsx";
import { SavedEventsProvider } from "../context/SavedEventsContext.jsx";
import { getClubById } from "../services/clubsApi";
import { searchEvents } from "../services/eventsApi";

vi.mock("../services/clubsApi", () => ({ getClubById: vi.fn() }));
vi.mock("../services/eventsApi", () => ({ searchEvents: vi.fn() }));

const club = {
  id: 1,
  name: "Tech Society",
  university: "Strathmore University",
  description: "Workshops and hackathons.",
  contactEmail: "tech@example.com",
  logoUrl: null,
};

const event = {
  id: 7,
  name: "Hack Night",
  description: "Build something.",
  imageUrl: null,
  startDate: "2026-12-20",
  startTime: "18:00:00",
  venueName: "Main Auditorium",
  city: "Nairobi",
  priceMin: 0,
  priceMax: 0,
  currency: "KES",
  category: "Technology",
};

function renderDetails(path = "/clubs/1") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SavedEventsProvider>
        <Routes>
          <Route path="/clubs/:id" element={<ClubDetails />} />
        </Routes>
      </SavedEventsProvider>
    </MemoryRouter>
  );
}

describe("ClubDetails page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.localStorage.clear();
  });

  it("shows the club and its events", async () => {
    getClubById.mockResolvedValue(club);
    searchEvents.mockResolvedValue([event]);
    renderDetails();

    expect(await screen.findByRole("heading", { name: "Tech Society" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "tech@example.com" })).toHaveAttribute(
      "href",
      "mailto:tech@example.com"
    );
    expect(await screen.findByRole("link", { name: "Hack Night" })).toBeInTheDocument();
    expect(searchEvents).toHaveBeenCalledWith({ keyword: "", clubId: "1" });
  });

  it("shows an empty state when the club has no events", async () => {
    getClubById.mockResolvedValue(club);
    searchEvents.mockResolvedValue([]);
    renderDetails();

    expect(await screen.findByText("This club has no events yet.")).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown club", async () => {
    getClubById.mockRejectedValue(Object.assign(new Error("Club not found."), { status: 404 }));
    searchEvents.mockResolvedValue([]);
    renderDetails("/clubs/999");

    expect(await screen.findByRole("alert")).toHaveTextContent("Club not found");
    expect(screen.getByRole("link", { name: /back to clubs/i })).toBeInTheDocument();
  });
});
