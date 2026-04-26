import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const offices = [
  "Blue Bell",
  "Chadds Ford",
  "Collegeville",
  "Doylestown",
  "Philadelphia",
  "Wayne",
  "West Chester",
  "Wilmington",
];

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [office, setOffice] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(cred.user, {
        displayName: fullName.trim(),
      });

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        fullName: fullName.trim(),
        office,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        role: "agent",
        createdAt: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("Signup failed. Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="brand-pill">WRC Matchboard</div>

        <h1>Create your account</h1>

        <p className="muted">
          Join the internal matching board for listing and buyer opportunities.
        </p>

        <form onSubmit={handleSignup} className="form-stack">
          <label>
            Full Name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label>
            Office
            <select
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              required
            >
              <option value="">Select Office</option>
              {offices.map((officeName) => (
                <option key={officeName} value={officeName}>
                  {officeName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Phone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
            />
          </label>

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
              minLength={6}
            />
          </label>

          {errorMsg && <div className="error-box">{errorMsg}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="small-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}