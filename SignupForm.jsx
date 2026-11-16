import { useState } from "react";

function SignupForm({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    university: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must have at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    alert("Registration form validated successfully!");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <input
        name="name"
        placeholder="Full name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="University email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="university"
        placeholder="University"
        value={form.university}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit">Sign up</button>

      <p>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch}>
          Log in
        </button>
      </p>
    </form>
  );
}

export default SignupForm;
