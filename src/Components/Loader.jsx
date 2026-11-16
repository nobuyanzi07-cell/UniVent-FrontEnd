function Loader({ label = "Loading events…" }) {
  return (
    <p className="loader" role="status">
      {label}
    </p>
  );
}

export default Loader;