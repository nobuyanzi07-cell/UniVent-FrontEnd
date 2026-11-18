import { Link } from "react-router-dom";
import EventCard from "../Components/EventCard.jsx";
import { useSavedEvents } from "../context/SavedEventsContext.jsx";

function SavedEvents() {
  const { saved } = useSavedEvents();

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
          <Link className="primary-action" to="/">
            Browse events <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : (
        <div className="saved-events-grid">
          {saved.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}

export default SavedEvents;