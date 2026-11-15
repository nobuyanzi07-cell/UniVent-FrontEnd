function Browse() {
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

      <section className="intro" id="get-started">
        <p className="eyebrow">Your campus, your calendar</p>
        <h2>There’s more happening around you.</h2>
        <p>
          UniVent brings student events, clubs, and campus communities together.
          Check back soon to see what’s on.
        </p>
      </section>
    </>
  );
}

export default Browse;