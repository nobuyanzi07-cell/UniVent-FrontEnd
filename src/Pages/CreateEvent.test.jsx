import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../services/apiClient";
import CreateEvent from "./CreateEvent.jsx";

const createEvent = vi.fn();
const listClubs = vi.fn();

vi.mock("../services/eventsApi", async (importOriginal) => ({
  ...(await importOriginal()),
  createEvent: (...args) => createEvent(...args),
}));
vi.mock("../services/clubsApi", async (importOriginal) => ({
  ...(await importOriginal()),
  listClubs: (...args) => listClubs(...args),
}));

function BrowseStub() {
  const { state } = useLocation();
  return <p>Browse page: {state?.createdEvent}</p>;
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/create"]}>
      <Routes>
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/" element={<BrowseStub />} />
      </Routes>
    </MemoryRouter>
  );
}

async function fillValidForm(user) {
  await user.type(screen.getByLabelText("Event name"), "Hack Night");
  await user.selectOptions(screen.getByLabelText("Category"), "Technology");
  await user.type(screen.getByLabelText("Description"), "Build things.");
  await user.selectOptions(screen.getByLabelText("University"), "Strathmore University");
  await screen.findByRole("option", { name: "Tech Society" });
  await user.selectOptions(screen.getByLabelText("Club"), "1");
  await user.type(screen.getByLabelText("Date"), "2026-12-20");
  await user.type(screen.getByLabelText("Venue"), "Auditorium");
  await user.type(screen.getByLabelText("City"), "Nairobi");
}

describe("CreateEvent", () => {
  beforeEach(() => {
    createEvent.mockReset();
    listClubs.mockReset();
    listClubs.mockResolvedValue([
      { id: 1, name: "Tech Society", university: "Strathmore University" },
    ]);
  });

  it("shows client errors and does not POST when required fields are empty", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: /create event/i }));

    expect(screen.getByText("Event name is required.")).toBeInTheDocument();
    expect(screen.getByText("Choose the club hosting this event.")).toBeInTheDocument();
    expect(createEvent).not.toHaveBeenCalled();
  });

  it("loads clubs for the chosen university", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.selectOptions(screen.getByLabelText("University"), "Strathmore University");

    expect(await screen.findByRole("option", { name: "Tech Society" })).toBeInTheDocument();
    expect(listClubs).toHaveBeenCalledWith({ university: "Strathmore University" });
  });

  it("shows a saving state, then goes to Browse on success", async () => {
    const user = userEvent.setup();
    let resolve;
    createEvent.mockReturnValue(new Promise((r) => (resolve = r)));
    renderPage();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /create event/i }));

    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();

    resolve({ id: 9, name: "Hack Night" });
    expect(await screen.findByText("Browse page: Hack Night")).toBeInTheDocument();
    expect(createEvent.mock.calls[0][0]).toMatchObject({ clubId: "1", name: "Hack Night" });
  });

  it("shows server validation errors next to their fields", async () => {
    const user = userEvent.setup();
    createEvent.mockRejectedValue(
      new ApiError("Validation failed", {
        status: 400,
        fieldErrors: {
          start_date: "Date must be in the future.",
          club_id: "Club does not match university.",
        },
      })
    );
    renderPage();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /create event/i }));

    expect(await screen.findByText("Date must be in the future.")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Date")).toHaveAttribute("aria-describedby", "event-date-error");
    expect(screen.getByText("Club does not match university.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Please fix the highlighted fields");
  });
});
