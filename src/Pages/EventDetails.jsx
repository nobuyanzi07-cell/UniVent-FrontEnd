import { Link, useParams } from "react-router-dom";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";
import { useEvent } from "../hooks/useEvent";
import { getErrorInfo } from "../services/errorMessages";

function formatDate(date, time) {
  if (!date) return "Date to be announced";
  const day = new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return time ? `${day}, ${time.slice(0, 5)}` : day;
}

function formatPrice(min, max, currency) {
  if (min == null && max == null) return "Price not available";
  if (min === 0 && (max === 0 || max == null)) return "Free";
  const code = currency ? `${currency} ` : "";
  if (max == null || min === max) return `${code}${min}`;
  return `${code}${min} – ${max}`;
}

function getMapUrl(event) {
  if (event.lat != null && event.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`;
  }
  const place = [event.venueName, event.city].filter(Boolean).join(", ");
  if (place) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  }
  return null;
}

function EventDetails() {
  const { id } = useParams();
  const { event, loading, error, refetch } = useEvent(id);
  const { isSaved, toggleSaved } = useSavedEvents();

  if (loading) {
    return (
      <p role="status" className="details-status">
        Loading event...
      </p>
    );
  }

  if (error || !event) {
    const info = getErrorInfo(error ?? { status: 404 });
    return (
      <div role="alert" className="details-error">
        <h1>{info.title}</h1>
        <p>{info.message}</p>
        <div className="details-actions">
          {info.canRetry && (
            <button type="button" className="details-btn" onClick={refetch}>
              Retry
            </button>
          )}
          <Link to="/" className="details-btn ghost">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const mapUrl = getMapUrl(event);
  const saved = isSaved(event.id);

  return (
    <article className="details-page">
      <Link to="/" className="details-back">
        ← Back to Browse
      </Link>

      {event.imageUrl ? (
        <img className="details-image" src={event.imageUrl} alt={event.name} />
      ) : (
        <div className="details-image placeholder" aria-hidden="true" />
      )}

      <header className="details-header">
        {event.category && <p className="eyebrow">{event.category}</p>}
        <h1>{event.name}</h1>
      </header>

      <dl className="details-list">
        <div>
          <dt>Date</dt>
          <dd>{formatDate(event.startDate, event.startTime)}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>
            {[event.venueName, event.city, event.country]
              .filter(Boolean)
              .join(", ") || "Venue to be announced"}
          </dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>{formatPrice(event.priceMin, event.priceMax, event.currency)}</dd>
        </div>
      </dl>

      {event.description && (
        <p className="details-description">{event.description}</p>
      )}

      <div className="details-actions">
        <button
          type="button"
          className={saved ? "details-btn saved" : "details-btn"}
          aria-pressed={saved}
          onClick={() => toggleSaved(event)}
        >
          {saved ? "Saved ✓" : "Save event"}
        </button>
        {event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="details-btn ghost"
          >
            Get tickets
          </a>
        )}
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="details-btn ghost"
          >
            View on map
          </a>
        )}
      </div>
    </article>
  );
}

export default EventDetails;