import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../services/apiClient";
import ClubForm from "./ClubForm.jsx";

const api = { createClub: vi.fn(), updateClub: vi.fn(), getClub: vi.fn() };

vi.mock("../services/clubsApi", async (importOriginal) => ({
  ...(await importOriginal()),
  createClub: (...a) => api.createClub(...a),
  updateClub: (...a) => api.updateClub(...a),
  getClub: (...a) => api.getClub(...a),
}));

vi.mock("../services/universitiesApi", () => ({
  listUniversities: async () => [
    { id: 2, name: "Kenyatta University", shortName: "KU" },
    { id: 3, name: "Strathmore University", shortName: "SU" },
  ],
}));

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/clubs/new" element={<ClubForm />} />
        <Route path="/clubs/:id/edit" element={<ClubForm />} />
      </Routes>
    </MemoryRouter>
  );
}

const club = {
  id: 3,
  name: "Chess Club",
  universityId: 2,
  universityName: "Kenyatta University",
  description: "We play chess.",
  contactEmail: "",
  logoUrl: "",
};

describe("ClubForm", () => {
  beforeEach(() => Object.values(api).forEach((fn) => fn.mockReset()));

  it("checks required fields before sending", async () => {
    const user = userEvent.setup();
    renderAt("/clubs/new");

    await user.click(screen.getByRole("button", { name: "Create club" }));

    expect(screen.getByText("Club name is required.")).toBeInTheDocument();
    expect(screen.getByText("Choose a university.")).toBeInTheDocument();
    expect(api.createClub).not.toHaveBeenCalled();
  });

  it("POSTs a new club and opens its edit page", async () => {
    const user = userEvent.setup();
    api.createClub.mockResolvedValue(club);
    api.getClub.mockResolvedValue(club);
    renderAt("/clubs/new");

    await user.type(screen.getByLabelText("Club name *"), "Chess Club");
    await screen.findByRole("option", { name: "Kenyatta University" });
    await user.selectOptions(screen.getByLabelText("University *"), "Kenyatta University");
    await user.type(screen.getByLabelText("Description *"), "We play chess.");
    await user.click(screen.getByRole("button", { name: "Create club" }));

    expect(await screen.findByText('"Chess Club" was created.')).toBeInTheDocument();
    expect(api.getClub).toHaveBeenCalledWith("3");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("loads the club and shows 400 field errors from PATCH", async () => {
    const user = userEvent.setup();
    api.getClub.mockResolvedValue(club);
    api.updateClub.mockRejectedValue(
      new ApiError("Validation failed", {
        status: 400,
        fieldErrors: { name: "A club with this name already exists." },
      })
    );
    renderAt("/clubs/3/edit");

    expect(await screen.findByDisplayValue("Chess Club")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("Kenyatta University")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(api.updateClub).toHaveBeenCalledWith("3", expect.objectContaining({ name: "Chess Club", universityId: "2" }));
    expect(await screen.findByText("A club with this name already exists.")).toBeInTheDocument();
    expect(screen.getByLabelText("Club name *")).toHaveAttribute("aria-invalid", "true");
  });
});
