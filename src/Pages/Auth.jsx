import { useSearchParams } from "react-router-dom";
import LoginForm from "../Components/LoginForm.jsx";
import SignupForm from "../Components/SignupForm.jsx";

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  // /auth shows login, /auth?mode=signup shows signup
  const isLogin = searchParams.get("mode") !== "signup";

  const showLogin = () => setSearchParams({});
  const showSignup = () => setSearchParams({ mode: "signup" });

  return (
    <main className="auth-page">
      <p className="eyebrow">UniVent</p>

      {isLogin ? <LoginForm /> : <SignupForm />}

      <p className="auth-note">
        Accounts aren’t live yet, so this form is a preview.
      </p>

      <p className="auth-switch">
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <button type="button" onClick={showSignup}>
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button type="button" onClick={showLogin}>
              Log in
            </button>
          </>
        )}
      </p>
    </main>
  );
}