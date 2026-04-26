import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
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

export default function EditMatchPost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [postType, setPostType] = useState("Listing Opportunity");
  const [title, setTitle] = useState("");
  const [office, setOffice] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [mlsId, setMlsId] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    async function loadPost() {
      try {
        const snap = await getDoc(doc(db, "matchPosts", postId));

        if (!snap.exists()) {
          setErrorMsg("This match post could not be found.");
          setLoading(false);
          return;
        }

        const data = snap.data();

        if (
          data.createdByUid !== auth.currentUser?.uid &&
          auth.currentUser?.email !== data.createdByEmail
        ) {
          // For now, keep it simple. Later, we will let admins edit everything based on role.
          setErrorMsg("You can only edit posts you created.");
          setLoading(false);
          return;
        }

        setPostType(data.postType || "Listing Opportunity");
        setTitle(data.title || "");
        setOffice(data.office || "");
        setPropertyAddress(data.propertyAddress || "");
        setCity(data.city || "");
        setZip(data.zip || "");
        setPriceRange(data.priceRange || "");
        setPropertyType(data.propertyType || "");
        setBeds(data.beds || "");
        setBaths(data.baths || "");
        setMlsId(data.mlsId || "");
        setNotes(data.notes || "");
        setStatus(data.status || "active");

        setLoading(false);
      } catch (err) {
        console.error("Error loading post:", err);
        setErrorMsg("Could not load this post.");
        setLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      await updateDoc(doc(db, "matchPosts", postId), {
        postType,
        title: title.trim(),
        office,
        propertyAddress: propertyAddress.trim(),
        city: city.trim(),
        zip: zip.trim(),
        priceRange: priceRange.trim(),
        propertyType: propertyType.trim(),
        beds: beds.trim(),
        baths: baths.trim(),
        mlsId: mlsId.trim(),
        notes: notes.trim(),
        status,
        updatedAt: serverTimestamp(),
      });

      navigate("/my-posts");
    } catch (err) {
      console.error("Error updating post:", err);
      setErrorMsg("Could not update this post. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-center">
        <div className="card">
          <h2>Loading post...</h2>
          <p>Pulling up your match details.</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="page-center">
        <div className="card">
          <h2>Something went wrong</h2>
          <p>{errorMsg}</p>
          <Link className="text-btn" to="/my-posts">
            Back to My Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-pill">WRC Matchboard</div>
          <h1>Edit Match Post</h1>
          <p>Update your listing opportunity, buyer need, or coming soon match.</p>
        </div>

        <div className="topbar-actions">
          <Link className="text-btn" to="/dashboard">
            Dashboard
          </Link>
          <Link className="text-btn" to="/my-posts">
            My Posts
          </Link>
        </div>
      </header>

      <main className="form-page">
        <form className="dashboard-card form-card" onSubmit={handleSubmit}>
          <h2>Update match details</h2>

          <label>
            Post Type
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              required
            >
              <option>Listing Opportunity</option>
              <option>Buyer Need</option>
              <option>Coming Soon</option>
              <option>Off-Market Opportunity</option>
              <option>Rental Need</option>
            </select>
          </label>

          <label>
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="matched">Matched</option>
              <option value="closed">Closed</option>
            </select>
          </label>

          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <div className="two-col">
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
              MLS ID
              <input value={mlsId} onChange={(e) => setMlsId(e.target.value)} />
            </label>
          </div>

          <label>
            Address or Area
            <input
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
            />
          </label>

          <div className="two-col">
            <label>
              City
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </label>

            <label>
              ZIP
              <input value={zip} onChange={(e) => setZip(e.target.value)} />
            </label>
          </div>

          <div className="two-col">
            <label>
              Price Range
              <input
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
            </label>

            <label>
              Property Type
              <input
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              />
            </label>
          </div>

          <div className="two-col">
            <label>
              Beds
              <input value={beds} onChange={(e) => setBeds(e.target.value)} />
            </label>

            <label>
              Baths
              <input value={baths} onChange={(e) => setBaths(e.target.value)} />
            </label>
          </div>

          <label>
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="5"
            />
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </main>
    </div>
  );
}