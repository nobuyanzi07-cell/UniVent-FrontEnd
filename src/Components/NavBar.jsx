import { Link, NavLink, useLocation } from "react-router-dom";

function NavBar() {
  const { pathname } = useLocation();

  const handleBrowse = (e) => {
    if (pathname === "/") {
      // Already on Browse: scroll to the events list
      e.preventDefault();
      document
        .getElementById("get-started")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="UniVent home">
        <span className="brand-mark" aria-hidden="true">
          U
        </span>
        UniVent
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        <NavLink to="/" end onClick={handleBrowse}>
          Browse
        </NavLink>
        <NavLink to="/saved">Saved</NavLink>
        <NavLink to="/create">Create</NavLink>
        <Link className="nav-action" to="/auth">
          Log in
        </Link>
      </nav>
    </header>
  );
}

export default NavBar;