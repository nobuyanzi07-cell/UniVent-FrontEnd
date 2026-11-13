import { useState, useEffect } from "react";

const STORAGE_KEY = "savedEvents";

function SavedEvents() {
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to parse saved events:", error);
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
  }, [saved]);

  const removeSavedEvent = (id) => {
    setSaved((prev) => prev.filter((event) => String(event.id) !== String(id)));
  };

  return (
    <section className="saved-events-page">
      <header className="saved-events-header">
        <p className="eyebrow">UniVent</p>
        <h1>Saved events</h1>
        <p>Events you save will be collected here.</p>
      </header>

      {saved.length === 0 ? (
        <div className="saved-events-empty">
          <p>No saved events yet.</p>
          <a className="primary-action" href="/">
            Browse events <span aria-hidden="true">→</span>
          </a>
        </div>
      ) : (
        <div className="saved-events-grid">
          {saved.map((event, index) => (
            <article className="saved-event-card" key={event.id ?? `${event.name ?? "event"}-${index}`}>
              <div className="saved-event-card__header">
                <span className="saved-event-tag">
                  {event.category ?? "Event"}
                </span>
                <button
                  type="button"
                  className="saved-event-remove"
                  onClick={() => removeSavedEvent(event.id)}
                >
                  Remove
                </button>
              </div>

              <h2>{event.name ?? event.title ?? "Untitled event"}</h2>
              <p className="saved-event-meta">
                {event.date ?? "Date TBD"}
              </p>
              <p className="saved-event-meta">
                {event.location ?? "Location TBD"}
              </p>

              {event.description ? (
                <p className="saved-event-description">{event.description}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SavedEvents;