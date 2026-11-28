import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SavedEventsProvider } from "../context/SavedEventsContext.jsx";
import { deleteEvent } from "../services/eventsApi";
import EventDetails from "./EventDetails.jsx";

vi.mock("../services/eventsApi", () => ({
  deleteEvent: vi.fn(async () => {}),
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
          <Route path="/" element={<p>Browse page</p>} />
          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </SavedEventsProvider>
    </MemoryRouter>
  );
}

describe("EventDetails page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

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

  it("asks for confirmation, then deletes and returns to Browse", async () => {
    renderDetails("/events/test-1");
    await userEvent.click(
      await screen.findByRole("button", { name: /delete event/i })
    );
    expect(deleteEvent).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: /yes, delete/i }));
    expect(deleteEvent).toHaveBeenCalledWith("test-1");
    expect(await screen.findByText("Browse page")).toBeInTheDocument();
  });

  it("cancel keeps the event", async () => {
    renderDetails("/events/test-1");
    await userEvent.click(
      await screen.findByRole("button", { name: /delete event/i })
    );
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(deleteEvent).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Test Event" })).toBeInTheDocument();
    expect(screen.queryByText(/can't be undone/i)).not.toBeInTheDocument();
  });

  it("shows an error and stays put when the delete fails", async () => {
    deleteEvent.mockRejectedValueOnce(
      Object.assign(new Error("Event not found"), { status: 404 })
    );
    renderDetails("/events/test-1");
    await userEvent.click(
      await screen.findByRole("button", { name: /delete event/i })
    );
    await userEvent.click(screen.getByRole("button", { name: /yes, delete/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Test Event" })).toBeInTheDocument();
  });
});