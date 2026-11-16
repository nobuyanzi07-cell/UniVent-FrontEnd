function ErrorMessage({ error, onRetry }) {
  const message =
    error?.status === 0
      ? "Network error. Check your connection and try again."
      : error?.status === 404
      ? "We couldn't find that."
      : "Something went wrong loading events.";

  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;