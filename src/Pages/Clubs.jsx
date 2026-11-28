import { useMemo, useState } from "react";
import ClubCard from "../Components/ClubCard.jsx";
import ErrorMessage from "../Components/ErrorMessage.jsx";
import Loader from "../Components/Loader.jsx";
import { useClubs } from "../hooks/useClubs";

function Clubs() {
  const { clubs, loading, error, refetch } = useClubs();
  const [university, setUniversity] = useState("");

  const universities = useMemo(
    () => [...new Set(clubs.map((c) => c.university).filter(Boolean))].sort(),
    [clubs]
  );

  const visible = useMemo(
    () => clubs.filter((c) => !university || c.university === university),
    [clubs, university]
  );

  return (
    <section className="clubs-page">
      <header className="clubs-header">
        <p className="eyebrow">Clubs</p>
        <h1>Find your club</h1>
        <p>Student clubs and campus offices across Nairobi’s universities.</p>
      </header>

      <div className="filters">
        <select
          aria-label="University"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        >
          <option value="">All universities</option>
          {universities.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        {!loading && !error && (
          <span className="meta count">
            {visible.length} club{visible.length !== 1 && "s"}
          </span>
        )}
      </div>

      {loading && <Loader label="Loading clubs…" />}
      {!loading && error && (
        <ErrorMessage error={error} onRetry={refetch} what="clubs" />
      )}
      {!loading && !error && visible.length === 0 && (
        <p className="empty">No clubs found.</p>
      )}
      {!loading && !error && visible.length > 0 && (
        <div className="club-grid">
          {visible.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Clubs;
