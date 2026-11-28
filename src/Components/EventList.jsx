import EventCard from "./EventCard.jsx";

function EventList({
  events,
  emptyMessage = "No events match your search or filters.",
}) {
  if (events.length === 0) {
    return <p className="empty">{emptyMessage}</p>;
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
