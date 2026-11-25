import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SavedEventsProvider } from "../context/SavedEventsContext.jsx";
import EventDetails from "./EventDetails.jsx";

vi.mock("../services/eventsApi", () => ({
  getEventById: vi.fn(async (id) => {
    if (id !== "test-1") {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }
    return {
      id: "test-1",
      name: "Test Event",
      description: "A test event.",
      imageUrl: null,
      startDate: "2026-12-05",
      startTime: "18:00:00",
      venueName: "Test Venue",
      city: "Nairobi",
      country: "Kenya",
      lat: null,
      lng: null,
      priceMin: 0,
      priceMax: 0,
      currency: "KES",
      category: "Technology",
      ticketUrl: null,
    };
  }),
}));

function renderDetails(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SavedEventsProvider>
        <Routes>
          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </SavedEventsProvider>
    </MemoryRouter>
  );
}

describe("EventDetails page", () => {
  beforeEach(() => window.localStorage.clear());

  it("shows the event and toggles Save", async () => {
    renderDetails("/events/test-1");
    expect(
      await screen.findByRole("heading", { name: "Test Event" })
    ).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /save event/i });
    await userEvent.click(button);
    expect(screen.getByRole("button", { name: /saved/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("shows a not-found message for an unknown event", async () => {
    renderDetails("/events/nope");
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to browse/i })).toBeInTheDocument();
  });
});