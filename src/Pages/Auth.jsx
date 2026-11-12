import { Link, useSearchParams } from "react-router-dom";
import PlaceholderPage from "./PlaceholderPage.jsx";

function Auth() {
  const [searchParams] = useSearchParams();
  // The query string selects which authentication placeholder to show.
  const isSignup = searchParams.get("mode") === "signup";

  return (
    <>
      <PlaceholderPage
        title={isSignup ? "Create your account" : "Log in"}
        description={
          isSignup
            ? "Sign-up is coming soon. This page is a preview."
            : "Login is coming soon. This page is a preview."
        }
      />
      <p className="route-switch">
        {isSignup ? "Already have an account?" : "New to UniVent?"}{" "}
        <Link to={isSignup ? "/auth" : "/auth?mode=signup"}>
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </>
  );
}

export default Auth;