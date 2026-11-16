import EventCard from "./EventCard.jsx";

function EventList({ events }) {
  if (events.length === 0) {
    return <p className="empty">No events match your search or filters.</p>;
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventList;