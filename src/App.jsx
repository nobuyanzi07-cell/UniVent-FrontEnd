import { Link } from "react-router-dom";
import NavBar from "./Components/NavBar.jsx";
import AppRoutes from "./routing/AppRoutes.jsx";

function App() {
  return (
    <div className="app-shell">
      <NavBar />

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

export default App;import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <div>
      <Navbar />
      <Auth />
    </div>
  );
}