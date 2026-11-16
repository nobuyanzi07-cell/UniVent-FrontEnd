import { Link, useParams } from "react-router-dom";
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

  if (loading) {
    return (
      <p role="status" className="p-6 text-center text-gray-600">
        Loading event...
      </p>
    );
  }

    if (error || !event) {
    const info = getErrorInfo(error ?? { status: 404 });
    return (
      <div role="alert" className="mx-auto max-w-md p-6 text-center">
        <h1 className="mb-2 text-xl font-semibold">{info.title}</h1>
        <p className="mb-4 text-gray-600">{info.message}</p>
        {info.canRetry && (
          <button
            type="button"
            onClick={refetch}
            className="mr-3 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        )}
        <Link to="/" className="text-blue-600 underline">
          Back to Browse
        </Link>
      </div>
    );
  }

  const mapUrl = getMapUrl(event);

  return (
    <article className="mx-auto max-w-3xl p-4">
      <Link to="/" className="mb-4 inline-block text-blue-600 underline">
        ← Back to Browse
      </Link>

      {event.imageUrl ? (
        <img
          src={event.imageUrl}
          alt={event.name}
          className="mb-4 h-64 w-full rounded object-cover"
        />
      ) : (
        <div className="mb-4 flex h-64 w-full items-center justify-center rounded bg-gray-200 text-gray-500">
          No image available
        </div>
      )}

      <h1 className="mb-1 text-2xl font-bold">{event.name}</h1>
      {event.category && (
        <p className="mb-4 text-sm text-gray-500">{event.category}</p>
      )}

      <dl className="mb-4 space-y-2">
        <div>
          <dt className="font-semibold">Date</dt>
          <dd>{formatDate(event.startDate, event.startTime)}</dd>
        </div>
        <div>
          <dt className="font-semibold">Venue</dt>
          <dd>
            {[event.venueName, event.city, event.country]
              .filter(Boolean)
              .join(", ") || "Venue to be announced"}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Price</dt>
          <dd>{formatPrice(event.priceMin, event.priceMax, event.currency)}</dd>
        </div>
      </dl>

      {event.description && <p className="mb-4">{event.description}</p>}

      <div className="flex flex-wrap gap-3">
        {event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Get tickets
          </a>
        )}
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            View on map
          </a>
        )}
      </div>
    </article>
  );
}

export default EventDetails;
