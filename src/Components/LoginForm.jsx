import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main>
      {isLogin ? <LoginForm /> : <SignupForm />}

      <div>
        {isLogin ? (
          <p>
            Don&apos;t have an account?{" "}
            <button type="button" onClick={() => setIsLogin(false)}>
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button type="button" onClick={() => setIsLogin(true)}>
              Log in
            </button>
          </p>
        )}
      </div>
    </main>
  );
}