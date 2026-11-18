import { useMemo, useState } from "react";
import "./CreateEvent.css";

const initialForm = {
  name: "",
  category: "",
  date: "",
  time: "",
  venue: "",
  city: "",
  price: "0",
  description: "",
  imageUrl: "",
};

const categories = [
  "Academic",
  "Arts & Culture",
  "Career",
  "Community",
  "Sports",
  "Technology",
  "Social",
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

function CreateEvent() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setSubmitted(false);

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validation = useMemo(() => {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Event name is required.";
    }

    if (!form.category) {
      errors.category = "Choose a category.";
    }

    if (!form.date) {
      errors.date = "Choose an event date.";
    }

    if (!form.venue.trim()) {
      errors.venue = "Venue is required.";
    }

    if (!form.city.trim()) {
      errors.city = "City is required.";
    }

    if (!form.description.trim()) {
      errors.description = "Add a short description.";
    }

    return errors;
  }, [form]);

  const isValid = Object.keys(validation).length === 0;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValid) {
      setSubmitted(false);
      return;
    }

    // KAN-5 is currently a frontend preview.
    // No backend request is made here.
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(initialForm);
    setSubmitted(false);
  };

  const priceLabel =
    Number(form.price) > 0 ? `KES ${form.price}` : "Free";

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
        >
          {/* EVENT DETAILS */}

          <div className="form-section">
            <div className="form-section-heading">
              <h2>Event details</h2>

              <p>
                Give your event a clear name and description.
              </p>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="event-name">
                Event name
              </label>

              <input
                id="event-name"
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Nairobi Campus Career Fair"
                aria-invalid={Boolean(validation.name)}
                aria-describedby={
                  validation.name
                    ? "event-name-error"
                    : undefined
                }
              />

              {validation.name && (
                <span
                  className="field-error"
                  id="event-name-error"
                >
                  {validation.name}
                </span>
              )}
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="event-category">
                  Category
                </label>

                <select
                  id="event-category"
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  aria-invalid={Boolean(validation.category)}
                >
                  <option value="">
                    Select a category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>

                {validation.category && (
                  <span className="field-error">
                    {validation.category}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="event-price">
                  Price (KES)
                </label>

                <input
                  id="event-price"
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={updateField}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="event-description">
                Description
              </label>

              <textarea
                id="event-description"
                name="description"
                value={form.description}
                onChange={updateField}
                rows="5"
                placeholder="Tell students what they can expect from this event."
                aria-invalid={Boolean(validation.description)}
              />

              {validation.description && (
                <span className="field-error">
                  {validation.description}
                </span>
              )}
            </div>
          </div>

          {/* DATE AND LOCATION */}

          <div className="form-section">
            <div className="form-section-heading">
              <h2>When and where</h2>

              <p>
                Help attendees know when and where to meet.
              </p>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="event-date">
                  Date
                </label>

                <input
                  id="event-date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={updateField}
                  aria-invalid={Boolean(validation.date)}
                />

                {validation.date && (
                  <span className="field-error">
                    {validation.date}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="event-time">
                  Time
                </label>

                <input
                  id="event-time"
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={updateField}
                />
              </div>

              <div className="form-field">
                <label htmlFor="event-venue">
                  Venue
                </label>

                <input
                  id="event-venue"
                  name="venue"
                  value={form.venue}
                  onChange={updateField}
                  placeholder="e.g. Main Auditorium"
                  aria-invalid={Boolean(validation.venue)}
                />

                {validation.venue && (
                  <span className="field-error">
                    {validation.venue}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="event-city">
                  City
                </label>

                <input
                  id="event-city"
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  placeholder="e.g. Nairobi"
                  aria-invalid={Boolean(validation.city)}
                />

                {validation.city && (
                  <span className="field-error">
                    {validation.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* IMAGE */}

          <div className="form-section">
            <div className="form-section-heading">
              <h2>Event image</h2>

              <p>
                Use an image URL for the preview. Upload support can be
                connected later.
              </p>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="event-image">
                Image URL
              </label>

              <input
                id="event-image"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={updateField}
                placeholder="https://example.com/event-image.jpg"
              />
            </div>
          </div>

          {/* SUCCESS STATE */}

          {submitted && (
            <div
              className="form-success"
              role="status"
            >
              <strong>
                Event preview is ready.
              </strong>

              <span>
                The frontend form is validated successfully.
                No event has been sent to a backend yet.
              </span>
            </div>
          )}

          {/* ACTIONS */}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={resetForm}
            >
              Reset
            </button>

            <button
              type="submit"
              className="primary-action form-submit"
            >
              {submitted
                ? "Preview ready"
                : "Create event preview"}

              <span aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </form>

        {/* LIVE PREVIEW */}

        <aside
          className="event-preview"
          aria-label="Event preview"
        >
          <div className="preview-heading">
            <div>
              <p className="eyebrow">
                Live preview
              </p>

              <h2>
                How your event will look
              </h2>
            </div>

            <span className="preview-badge">
              Preview
            </span>
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
                <span aria-hidden="true">
                  U
                </span>
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

              <h3>
                {form.name.trim() || "Your event name"}
              </h3>

              <p className="preview-meta">
                {formatPreviewDate(
                  form.date,
                  form.time
                )}
              </p>

              <p className="preview-meta">
                {[
                  form.venue.trim(),
                  form.city.trim(),
                ]
                  .filter(Boolean)
                  .join(", ") ||
                  "Venue and city"}
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