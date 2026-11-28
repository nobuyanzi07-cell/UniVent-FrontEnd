import { Link } from "react-router-dom";

function ClubCard({ club }) {
  return (
    <article className="club-card">
      <div className="club-card-head">
        {club.logoUrl ? (
          <img className="club-logo" src={club.logoUrl} alt="" loading="lazy" />
        ) : (
          <span className="club-logo placeholder" aria-hidden="true">
            {club.name.charAt(0)}
          </span>
        )}
        <div>
          <span className="tag">{club.university}</span>
          <h3>
            <Link to={`/clubs/${club.id}`}>{club.name}</Link>
          </h3>
        </div>
      </div>
      <p className="club-desc">{club.description}</p>
      <Link to={`/clubs/${club.id}`} className="btn ghost">
        View club
      </Link>
    </article>
  );
}

export default ClubCard;
