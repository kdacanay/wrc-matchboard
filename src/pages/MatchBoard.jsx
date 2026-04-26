import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function MatchBoard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [postTypeFilter, setPostTypeFilter] = useState("all");
  const [officeFilter, setOfficeFilter] = useState("all");

  useEffect(() => {
    const q = query(
      collection(db, "matchPosts"),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const nextPosts = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setPosts(nextPosts);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading match posts:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const filteredPosts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        !searchTerm ||
        [
          post.title,
          post.postType,
          post.office,
          post.propertyAddress,
          post.city,
          post.zip,
          post.priceRange,
          post.propertyType,
          post.mlsId,
          post.notes,
          post.createdByName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);

      const matchesPostType =
        postTypeFilter === "all" || post.postType === postTypeFilter;

      const matchesOffice =
        officeFilter === "all" || post.office === officeFilter;

      return matchesSearch && matchesPostType && matchesOffice;
    });
  }, [posts, search, postTypeFilter, officeFilter]);

  const uniquePostTypes = Array.from(
    new Set(posts.map((post) => post.postType).filter(Boolean))
  );

  const uniqueOffices = Array.from(
    new Set(posts.map((post) => post.office).filter(Boolean))
  );

async function handleInterested(post) {
  const user = auth.currentUser;

  if (!user) {
    alert("Please sign in first.");
    return;
  }

  if (post.createdByUid === user.uid) {
    alert("You cannot mark yourself interested in your own post.");
    return;
  }

  try {
    await addDoc(collection(db, "matchInterests"), {
      postId: post.id,
      postTitle: post.title || "",
      postType: post.postType || "",
      postOwnerUid: post.createdByUid || "",
      postOwnerEmail: post.createdByEmail || "",
      postOwnerName: post.createdByName || "",
      interestedAgentUid: user.uid,
      interestedAgentEmail: user.email || "",
      interestedAgentName: user.displayName || user.email || "",
      status: "interested",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    alert("Interest sent! The posting agent will be able to see your interest soon.");
  } catch (err) {
    console.error("Error saving interest:", err);
    alert("Could not save your interest. Please try again.");
  }
}

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-pill">WRC Matchboard</div>
          <h1>Browse Matchboard</h1>
          <p>
            Search active listing opportunities, buyer needs, coming soon
            properties, and internal brokerage matches.
          </p>
        </div>

        <div className="topbar-actions">
          <Link className="text-btn" to="/dashboard">
            Dashboard
          </Link>
          <Link className="text-btn" to="/create">
            Post a Match
          </Link>
          <Link className="text-btn" to="/my-posts">
            My Posts
          </Link>
        </div>
      </header>

      <main className="board-layout">
        <section className="dashboard-card filter-card">
          <div>
            <h2>Active matches</h2>
            <p>
              {loading
                ? "Loading posts..."
                : `${filteredPosts.length} of ${posts.length} posts showing`}
            </p>
          </div>

          <div className="filter-grid">
            <label>
              Search
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city, office, MLS ID, notes, agent..."
              />
            </label>

            <label>
              Post Type
              <select
                value={postTypeFilter}
                onChange={(e) => setPostTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {uniquePostTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Office
              <select
                value={officeFilter}
                onChange={(e) => setOfficeFilter(e.target.value)}
              >
                <option value="all">All Offices</option>
                {uniqueOffices.map((office) => (
                  <option key={office} value={office}>
                    {office}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {loading ? (
          <section className="dashboard-card">
            <h3>Loading...</h3>
            <p>Finding active match opportunities.</p>
          </section>
        ) : filteredPosts.length === 0 ? (
          <section className="dashboard-card">
            <h3>No matches found</h3>
            <p>
              Try clearing your filters or create the first match opportunity.
            </p>
            <Link className="text-btn" to="/create">
              Post a Match
            </Link>
          </section>
        ) : (
          <section className="post-grid">
            {filteredPosts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-card-top">
                  <span className="status-pill">{post.postType}</span>
                  {post.office && (
                    <span className="office-pill">{post.office}</span>
                  )}
                </div>

                <h3>{post.title}</h3>

                <div className="post-meta">
                  {post.city && <span>{post.city}</span>}
                  {post.zip && <span>{post.zip}</span>}
                  {post.priceRange && <span>{post.priceRange}</span>}
                </div>

                {post.propertyAddress && (
                  <p className="post-address">{post.propertyAddress}</p>
                )}

                <div className="post-details">
                  {post.propertyType && <span>{post.propertyType}</span>}
                  {post.beds && <span>{post.beds} beds</span>}
                  {post.baths && <span>{post.baths} baths</span>}
                  {post.mlsId && <span>MLS: {post.mlsId}</span>}
                </div>

                {post.notes && <p className="post-notes">{post.notes}</p>}

                <div className="post-footer">
                  <span>Posted by {post.createdByName || "WRC Agent"}</span>
                 <button type="button" onClick={() => handleInterested(post)}>
  Interested
</button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}