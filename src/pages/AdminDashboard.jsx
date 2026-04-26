import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function AdminDashboard() {
  async function handleSignOut() {
    await signOut(auth);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-pill">WRC Matchboard Admin</div>
          <h1>Admin Dashboard</h1>
          <p>
            Manage match opportunities, users, posts, activity, and
            brokerage-wide matching.
          </p>
        </div>

        <button className="secondary-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </header>

      <main className="dashboard-grid">
        <section className="dashboard-card hero-card">
          <h2>Admin control center</h2>
          <p>
            This is where admins will monitor all posts, agent activity, match
            interest, expired posts, and reporting.
          </p>
        </section>

        <section className="dashboard-card">
          <h3>All Match Posts</h3>
          <p>Review, search, edit, archive, or delete match opportunities.</p>
          <Link className="text-btn" to="/matchboard">
            View Matchboard
          </Link>
        </section>

        <section className="dashboard-card">
          <h3>Post a Match</h3>
          <p>Create a match post on behalf of the brokerage or an agent.</p>
          <Link className="text-btn" to="/create">
            Post a Match
          </Link>
        </section>

        <section className="dashboard-card">
          <h3>My Posts</h3>
          <p>View posts submitted from your admin account.</p>
          <Link className="text-btn" to="/my-posts">
            View My Posts
          </Link>
        </section>
      </main>
    </div>
  );
}