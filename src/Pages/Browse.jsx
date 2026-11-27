import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorMessage from "../Components/ErrorMessage.jsx";
import EventList from "../Components/EventList.jsx";
import Filters from "../Components/Filters.jsx";
import Loader from "../Components/Loader.jsx";
import SearchBar from "../Components/SearchBar.jsx";
import { useEvents } from "../hooks/useEvents";

const defaultFilters = { category: "", freeOnly: false, sort: "date-asc" };

function Browse() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const { events, loading, error, refetch } = useEvents({ keyword: query });
  const createdEvent = useLocation().state?.createdEvent;

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const categories = useMemo(
    () => [...new Set(events.map((e) => e.category).filter(Boolean))].sort(),
    [events]
  );

  const visible = useMemo(() => {
    const list = events.filter((e) => {
      if (filters.category && e.category !== filters.category) return false;
      if (filters.freeOnly && e.priceMax !== 0) return false;
      return true;
    });

    list.sort((a, b) => {
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      const diff = (a.startDate ?? "").localeCompare(b.startDate ?? "");
      return filters.sort === "date-desc" ? -diff : diff;
    });
    return list;
  }, [events, filters]);

  const reset = () => {
    setQuery("");
    setFilters(defaultFilters);
  };

  return (
    <>
      <section className="hero" id="events">
        <p className="eyebrow">Campus life starts here</p>
        <h1>Find your people. Find your next event.</h1>
        <p className="hero-copy">
          Discover what’s happening across Nairobi’s universities, all in one
          place.
        </p>
        <a className="primary-action" href="#get-started">
          Explore campus events <span aria-hidden="true">→</span>
        </a>
        <div className="hero-note" aria-label="Made for campus communities">
          <span className="note-dot" aria-hidden="true" />
          Made for campus communities
        </div>
      </section>

      <section className="browse" id="get-started">
        <p className="eyebrow">Your campus, your calendar</p>
        <h2>There’s more happening around you.</h2>
        
        {createdEvent && (
          <p className="form-success" role="status">
            <strong>“{createdEvent}” was published.</strong>
          </p>
        )}

        <SearchBar value={query} onChange={setQuery} />
        <Filters
          filters={filters}
          categories={categories}
          onChange={setFilter}
          onReset={reset}
          count={visible.length}
        />

        {loading && <Loader />}
        {!loading && error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && <EventList events={visible} />}
      </section>
    </>
  );
}

export default Browse;