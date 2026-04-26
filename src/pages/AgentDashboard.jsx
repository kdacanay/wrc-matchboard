import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function AgentDashboard() {
  async function handleSignOut() {
    await signOut(auth);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-pill">WRC Matchboard</div>
          <h1>Agent Dashboard</h1>
          <p>
            Share listing opportunities, buyer needs, coming soon properties,
            and possible matches across WRC.
          </p>
        </div>

        <button className="secondary-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </header>

      <main className="dashboard-grid">
        <section className="dashboard-card hero-card">
          <h2>Your brokerage matching hub</h2>
          <p>
            Use Matchboard to post opportunities, browse what other agents are
            sharing, and connect when there may be a buyer or listing fit.
          </p>
        </section>

        <section className="dashboard-card">
          <h3>Post a Match</h3>
          <p>Create a listing opportunity, buyer need, or coming soon match post.</p>
          <Link className="text-btn" to="/create">
            Post a Match
          </Link>
        </section>

        <section className="dashboard-card">
          <h3>Browse Matchboard</h3>
          <p>Search active opportunities across WRC offices.</p>
          <Link className="text-btn" to="/matchboard">
            Browse Matchboard
          </Link>
        </section>

        <section className="dashboard-card">
          <h3>My Posts</h3>
          <p>Manage the opportunities you submitted.</p>
          <Link className="text-btn" to="/my-posts">
            View My Posts
          </Link>
        </section>
      </main>
    </div>
  );
}