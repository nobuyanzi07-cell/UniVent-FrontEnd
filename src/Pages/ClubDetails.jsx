import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../Components/ErrorMessage.jsx";
import EventList from "../Components/EventList.jsx";
import Loader from "../Components/Loader.jsx";
import { useClub } from "../hooks/useClub";
import { useEvents } from "../hooks/useEvents";
import { getErrorInfo } from "../services/errorMessages";

function ClubDetails() {
  const { id } = useParams();
  const { club, loading, error, refetch } = useClub(id);
  const events = useEvents({ clubId: id });

  if (loading) return <Loader label="Loading club…" />;

  if (error || !club) {
    const info = getErrorInfo(error ?? { status: 404 }, "club");
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
          <Link to="/clubs" className="details-btn ghost">
            Back to clubs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="club-details">
      <Link to="/clubs" className="details-back">
        ← Back to clubs
      </Link>

      <header className="club-details-header">
        {club.logoUrl ? (
          <img className="club-logo large" src={club.logoUrl} alt="" />
        ) : (
          <span className="club-logo large placeholder" aria-hidden="true">
            {club.name.charAt(0)}
          </span>
        )}
        <div>
          <span className="tag">{club.university}</span>
          <h1>{club.name}</h1>
        </div>
      </header>

      <p className="details-description">{club.description}</p>

      {club.contactEmail && (
        <p className="club-contact">
          Contact: <a href={`mailto:${club.contactEmail}`}>{club.contactEmail}</a>
        </p>
      )}

      <section className="club-events">
        <h2>Events by {club.name}</h2>
        {events.loading && <Loader />}
        {!events.loading && events.error && (
          <ErrorMessage error={events.error} onRetry={events.refetch} />
        )}
        {!events.loading && !events.error && (
          <EventList
            events={events.events}
            emptyMessage="This club has no events yet."
          />
        )}
      </section>
    </article>
  );
}

export default ClubDetails;
