// Shared preview layout; each route supplies its own title and description.
function PlaceholderPage({ title, description }) {
  return (
    <section className="route-placeholder">
      <p className="eyebrow">UniVent</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

export default PlaceholderPage;
