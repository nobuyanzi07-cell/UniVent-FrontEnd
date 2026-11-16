import { Link } from "react-router-dom";

function formatDate(startDate, startTime) {
  if (!startDate) return "Date to be announced";
  const date = new Date(`${startDate}T${startTime ?? "00:00:00"}`);
  const day = date.toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (!startTime) return day;
  const time = date.toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day} · ${time}`;
}

function priceLabel({ priceMin, priceMax, currency }) {
  if (priceMin == null) return "See details";
  if (priceMax === 0) return "Free";
  const from = `${currency ?? ""} ${priceMin}`.trim();
  return priceMin === priceMax ? from : `${from} – ${priceMax}`;
}

function EventCard({ event }) {
  return (
    <article className="event-card">
      {event.imageUrl ? (
        <img className="event-image" src={event.imageUrl} alt="" loading="lazy" />
      ) : (
        <div className="event-image placeholder" aria-hidden="true" />
      )}

      <div className="event-body">
        <div className="tags">
          {event.category && <span className="tag">{event.category}</span>}
          <span className="tag alt">{priceLabel(event)}</span>
        </div>

        <h3>
          <Link to={`/events/${event.id}`}>{event.name}</Link>
        </h3>

        <p className="meta">{formatDate(event.startDate, event.startTime)}</p>
        <p className="meta">
          {[event.venueName, event.city].filter(Boolean).join(", ")}
        </p>

        <div className="actions">
          <Link to={`/events/${event.id}`} className="btn ghost">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;