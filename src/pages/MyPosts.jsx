import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "matchPosts"),
      where("createdByUid", "==", auth.currentUser.uid),
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
        console.error("Error loading my posts:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  async function handleArchivePost(postId) {
  const confirmed = window.confirm(
    "Archive this post? It will be removed from the active Matchboard but kept in your records."
  );

  if (!confirmed) return;

  try {
    await updateDoc(doc(db, "matchPosts", postId), {
      status: "archived",
      archivedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error archiving post:", err);
    alert("Could not archive this post. Please try again.");
  }
}
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-pill">WRC Matchboard</div>
          <h1>My Posts</h1>
          <p>View and manage the match opportunities you have submitted.</p>
        </div>

        <div className="topbar-actions">
          <Link className="text-btn" to="/dashboard">
            Dashboard
          </Link>
          <Link className="text-btn" to="/create">
            Post a Match
          </Link>
          <Link className="text-btn" to="/matchboard">
            Browse
          </Link>
        </div>
      </header>

      <main className="board-layout">
        <section className="dashboard-card filter-card">
          <div>
            <h2>Your submitted match posts</h2>
            <p>
              {loading
                ? "Loading your posts..."
                : `${posts.length} post${posts.length === 1 ? "" : "s"} found`}
            </p>
          </div>
        </section>

        {loading ? (
          <section className="dashboard-card">
            <h3>Loading...</h3>
            <p>Finding your submitted match opportunities.</p>
          </section>
        ) : posts.length === 0 ? (
          <section className="dashboard-card">
            <h3>No posts yet</h3>
            <p>
              Once you submit a listing opportunity, buyer need, or coming soon
              match, it will appear here.
            </p>
            <Link className="text-btn" to="/create">
              Create Your First Post
            </Link>
          </section>
        ) : (
          <section className="post-grid">
            {posts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-card-top">
                  <span className="status-pill">{post.postType}</span>
                  {post.status && (
                    <span className="office-pill">
                      {post.status === "active" ? "Active" : post.status}
                    </span>
                  )}
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
                  <span>
                    {post.createdAt?.toDate
                      ? `Posted ${post.createdAt.toDate().toLocaleDateString()}`
                      : "Recently posted"}
                  </span>

                  <div className="post-actions">
                   <Link className="text-btn" to={`/edit/${post.id}`}>
  Edit
</Link>
                   <button
  type="button"
  className="secondary-btn"
  onClick={() => handleArchivePost(post.id)}
>
  Archive
</button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}