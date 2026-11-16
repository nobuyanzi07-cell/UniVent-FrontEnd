function Filters({ filters, categories, onChange, onReset, count }) {
  return (
    <div className="filters">
      <select
        aria-label="Category"
        value={filters.category}
        onChange={(e) => onChange("category", e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort"
        value={filters.sort}
        onChange={(e) => onChange("sort", e.target.value)}
      >
        <option value="date-asc">Soonest first</option>
        <option value="date-desc">Latest first</option>
        <option value="name">A–Z</option>
      </select>

      <label className="check">
        <input
          type="checkbox"
          checked={filters.freeOnly}
          onChange={(e) => onChange("freeOnly", e.target.checked)}
        />
        Free only
      </label>

      <button type="button" className="btn ghost" onClick={onReset}>
        Reset
      </button>

      <span className="meta count">
        {count} event{count !== 1 && "s"}
      </span>
    </div>
  );
}

export default Filters;