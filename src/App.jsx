import { Link } from "react-router-dom";
import AppRoutes from "./routing/AppRoutes.jsx";

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="UniVent home">
          <span className="brand-mark" aria-hidden="true">
            U
          </span>
          UniVent
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/">Browse</Link>
          <Link to="/saved">Saved</Link>
          <Link to="/create">Create</Link>
          <Link className="nav-action" to="/auth">
            Log in
          </Link>
        </nav>
      </header>

      <main>
        {/* AppRoutes selects the page for the current URL inside the shared layout. */}
        <AppRoutes />
      </main>

      <footer className="site-footer">
        <Link className="brand footer-brand" to="/" aria-label="UniVent home">
          <span className="brand-mark" aria-hidden="true">
            U
          </span>
          UniVent
        </Link>
        <p>Campus events, together.</p>
      </footer>
    </div>
  );
}

export default App;
