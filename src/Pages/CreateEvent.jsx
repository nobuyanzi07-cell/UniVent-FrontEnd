import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClubs } from "../hooks/useClubs";
import { useUniversities } from "../hooks/useUniversities";
import { createEvent, EVENT_FIELD_MAP } from "../services/eventsApi";
import { mapFieldErrors } from "../services/formErrors";
import "./CreateEvent.css";

const initialForm = {
  name: "",
  category: "",
  universityId: "",
  clubId: "",
  date: "",
  time: "",
  venue: "",
  city: "",
  price: "0",
  description: "",
  imageUrl: "",
};

// Same names as the backend seed data, so Browse's category filter stays tidy.
const categories = [
  "Academic",
  "Arts",
  "Business",
  "Career",
  "Community",
  "Music",
  "Social",
  "Sports",
  "Tech",
];

function formatPreviewDate(date, time) {
  if (!date) return "Date to be announced";

  const value = new Date(`${date}T${time || "00:00"}`);

  if (Number.isNaN(value.getTime())) {
    return "Date to be announced";
  }

  const formattedDate = value.toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (!time) return formattedDate;

  return `${formattedDate} · ${value.toLocaleTimeString("en-KE", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

// Client-side checks run before we send anything to the server.
function validate(form) {
  const errors = {};

  if (!form.name.trim()) errors.name = "Event name is required.";
  if (!form.category) errors.category = "Choose a category.";
  if (!form.universityId) errors.universityId = "Choose a university.";
  if (!form.clubId) errors.clubId = "Choose the club hosting this event.";
  if (!form.date) errors.date = "Choose an event date.";
  if (!form.venue.trim()) errors.venue = "Venue is required.";
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.description.trim()) errors.description = "Add a short description.";
  if (form.price !== "" && Number(form.price) < 0) {
    errors.price = "Price cannot be negative.";
  }

  return errors;
}

// Renders a field's error message with an id the input can point to.
function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <span className="field-error" id={id}>
      {message}
    </span>
  );
}

function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    universities,
    loading: universitiesLoading,
    error: universitiesError,
    refetch: refetchUniversities,
  } = useUniversities();

  const {
    clubs,
    loading: clubsLoading,
    error: clubsError,
    refetch: refetchClubs,
  } = useClubs(form.universityId);

  const clientErrors = useMemo(() => validate(form), [form]);

  // Server errors win over client errors for the same field.
  const errors = { ...(showErrors ? clientErrors : {}), ...serverErrors };

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      // A club belongs to one university, so changing university clears the club.
      ...(name === "universityId" ? { clubId: "" } : {}),
    }));

    // Editing a field clears the server's error for it.
    setServerErrors((previous) => {
      if (!previous[name] && !(name === "universityId" && previous.clubId)) {
        return previous;
      }
      const next = { ...previous };
      delete next[name];
      if (name === "universityId") delete next.clubId;
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowErrors(true);
    setFormError("");

    if (Object.keys(clientErrors).length > 0) return;

    setSaving(true);
    try {
      const created = await createEvent(form);
      // Client-side navigation: Browse re-fetches on mount, so the new
      // event shows up without a full page reload.
      navigate("/", { state: { createdEvent: created.name } });
    } catch (error) {
      const fieldErrors = mapFieldErrors(error.fieldErrors, EVENT_FIELD_MAP);
      setServerErrors(fieldErrors);

      if (error.status === 0) {
        setFormError("We could not reach the server. Check your connection and try again.");
      } else if (Object.keys(fieldErrors).length > 0) {
        setFormError("Please fix the highlighted fields and try again.");
      } else {
        setFormError(error.message || "Something went wrong while saving the event.");
      }
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setShowErrors(false);
    setServerErrors({});
    setFormError("");
  };

  // Props shared by every input: invalid state + link to its error message.
  const fieldProps = (name, id) => ({
    id,
    name,
    value: form[name],
    onChange: updateField,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${id}-error` : undefined,
  });

  const selectedClub = clubs.find((club) => String(club.id) === form.clubId);
  const selectedUniversity = universities.find(
    (university) => String(university.id) === form.universityId
  );

  const priceLabel = Number(form.price) > 0 ? `KES ${form.price}` : "Free";

  let clubPlaceholder = "Select a club";
  if (!form.universityId) clubPlaceholder = "Choose a university first";
  else if (clubsLoading) clubPlaceholder = "Loading clubs…";
  else if (clubsError) clubPlaceholder = "Could not load clubs";
  else if (clubs.length === 0) clubPlaceholder = "No clubs at this university yet";

  return (
    <section className="create-event-page">
      <div className="create-event-header">
        <div>
          <p className="eyebrow">Create an event</p>

          <h1>Share something happening on campus.</h1>

          <p className="create-event-intro">
            Add the event details below and use the live preview to see how it
            will appear to UniVent users.
          </p>
        </div>
      </div>

      <div className="create-event-layout">
        <form
          className="event-form"
          onSubmit={handleSubmit}
          noValidate
          aria-busy={saving}
        >
          {/* Disabling the fieldset locks every input while saving. */}
          <fieldset className="form-fieldset" disabled={saving}>
            {/* EVENT DETAILS */}

            <div className="form-section">
              <div className="form-section-heading">
                <h2>Event details</h2>

                <p>Give your event a clear name and description.</p>
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="event-name">Event name</label>

                <input
                  {...fieldProps("name", "event-name")}
                  placeholder="e.g. Nairobi Campus Career Fair"
                />

                <FieldError id="event-name-error" message={errors.name} />
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="event-category">Category</label>

                  <select {...fieldProps("category", "event-category")}>
                    <option value="">Select a category</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <FieldError
                    id="event-category-error"
                    message={errors.category}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="event-price">Price (KES)</label>

                  <input
                    {...fieldProps("price", "event-price")}
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                  />

                  <FieldError id="event-price-error" message={errors.price} />
                </div>
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="event-description">Description</label>

                <textarea
                  {...fieldProps("description", "event-description")}
                  rows="5"
                  placeholder="Tell students what they can expect from this event."
                />

                <FieldError
                  id="event-description-error"
                  message={errors.description}
                />
              </div>
            </div>

            {/* HOST */}

            <div className="form-section">
              <div className="form-section-heading">
                <h2>Host</h2>

                <p>
                  Pick the university, then the club hosting the event. The
                  event belongs to the club&apos;s university.
                </p>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="event-university">University</label>

                  <select
                    {...fieldProps("universityId", "event-university")}
                    disabled={universitiesLoading || universities.length === 0}
                  >
                    <option value="">
                      {universitiesLoading
                        ? "Loading universities…"
                        : universitiesError
                        ? "Could not load universities"
                        : "Select a university"}
                    </option>

                    {universities.map((university) => (
                      <option key={university.id} value={String(university.id)}>
                        {university.name}
                      </option>
                    ))}
                  </select>

                  <FieldError
                    id="event-university-error"
                    message={errors.universityId}
                  />

                  {universitiesError && (
                    <button
                      type="button"
                      className="link-button"
                      onClick={refetchUniversities}
                    >
                      Try loading universities again
                    </button>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="event-club">Club</label>

                  <select
                    {...fieldProps("clubId", "event-club")}
                    disabled={!form.universityId || clubsLoading || clubs.length === 0}
                  >
                    <option value="">{clubPlaceholder}</option>

                    {clubs.map((club) => (
                      <option key={club.id} value={String(club.id)}>
                        {club.name}
                      </option>
                    ))}
                  </select>

                  <FieldError id="event-club-error" message={errors.clubId} />

                  {clubsError && (
                    <button
                      type="button"
                      className="link-button"
                      onClick={refetchClubs}
                    >
                      Try loading clubs again
                    </button>
                  )}

                  {form.universityId &&
                    !clubsLoading &&
                    !clubsError &&
                    clubs.length === 0 && (
                      <Link className="field-hint" to="/clubs/new">
                        Create a club for this university
                      </Link>
                    )}
                </div>
              </div>
            </div>

            {/* DATE AND LOCATION */}

            <div className="form-section">
              <div className="form-section-heading">
                <h2>When and where</h2>

                <p>Help attendees know when and where to meet.</p>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="event-date">Date</label>

                  <input {...fieldProps("date", "event-date")} type="date" />

                  <FieldError id="event-date-error" message={errors.date} />
                </div>

                <div className="form-field">
                  <label htmlFor="event-time">Time</label>

                  <input {...fieldProps("time", "event-time")} type="time" />

                  <FieldError id="event-time-error" message={errors.time} />
                </div>

                <div className="form-field">
                  <label htmlFor="event-venue">Venue</label>

                  <input
                    {...fieldProps("venue", "event-venue")}
                    placeholder="e.g. Main Auditorium"
                  />

                  <FieldError id="event-venue-error" message={errors.venue} />
                </div>

                <div className="form-field">
                  <label htmlFor="event-city">City</label>

                  <input
                    {...fieldProps("city", "event-city")}
                    placeholder="e.g. Nairobi"
                  />

                  <FieldError id="event-city-error" message={errors.city} />
                </div>
              </div>
            </div>

            {/* IMAGE */}

            <div className="form-section">
              <div className="form-section-heading">
                <h2>Event image</h2>

                <p>Paste a link to an image for the event card.</p>
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="event-image">Image URL</label>

                <input
                  {...fieldProps("imageUrl", "event-image")}
                  type="url"
                  placeholder="https://example.com/event-image.jpg"
                />

                <FieldError id="event-image-error" message={errors.imageUrl} />
              </div>
            </div>
          </fieldset>

          {/* FORM-LEVEL ERROR */}

          {formError && (
            <div className="form-error" role="alert">
              {formError}
            </div>
          )}

          {/* ACTIONS */}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={resetForm}
              disabled={saving}
            >
              Reset
            </button>

            <button
              type="submit"
              className="primary-action form-submit"
              disabled={saving}
            >
              {saving ? "Saving…" : "Create event"}

              {!saving && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </form>

        {/* LIVE PREVIEW */}

        <aside className="event-preview" aria-label="Event preview">
          <div className="preview-heading">
            <div>
              <p className="eyebrow">Live preview</p>

              <h2>How your event will look</h2>
            </div>

            <span className="preview-badge">Preview</span>
          </div>

          <article className="preview-card">
            {form.imageUrl ? (
              <img
                className="preview-image"
                src={form.imageUrl}
                alt=""
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="preview-image preview-image-placeholder">
                <span aria-hidden="true">U</span>
              </div>
            )}

            <div className="preview-card-body">
              <div className="preview-tags">
                <span className="preview-tag">
                  {form.category || "Category"}
                </span>

                <span className="preview-tag preview-tag-alt">
                  {priceLabel}
                </span>
              </div>

              <h3>{form.name.trim() || "Your event name"}</h3>

              <p className="preview-meta">
                {[selectedClub?.name, selectedUniversity?.name]
                  .filter(Boolean)
                  .join(" · ") || "Club and university"}
              </p>

              <p className="preview-meta">
                {formatPreviewDate(form.date, form.time)}
              </p>

              <p className="preview-meta">
                {[form.venue.trim(), form.city.trim()]
                  .filter(Boolean)
                  .join(", ") || "Venue and city"}
              </p>

              <p className="preview-description">
                {form.description.trim() ||
                  "Your event description will appear here."}
              </p>
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}

export default CreateEvent;
