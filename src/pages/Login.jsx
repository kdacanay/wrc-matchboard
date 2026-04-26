import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-pill">WRC Matchboard</div>

        <h1>Welcome back</h1>

        <p className="muted">
          Sign in to view brokerage match opportunities.
        </p>

        <form onSubmit={handleLogin} className="form-stack">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {errorMsg && <div className="error-box">{errorMsg}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="small-text">
          Need an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}