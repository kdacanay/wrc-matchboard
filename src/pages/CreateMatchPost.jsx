import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

export default function CreateMatchPost() {
  const navigate = useNavigate();

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

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "matchPosts"), {
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
        status: "active",
        createdByUid: user.uid,
        createdByEmail: user.email,
        createdByName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      navigate("/matchboard");
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not save this match post. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-pill">WRC Matchboard</div>
          <h1>Post a Match</h1>
          <p>
            Share a listing opportunity, buyer need, coming soon property, or
            internal brokerage match.
          </p>
        </div>

        <div className="topbar-actions">
          <Link className="text-btn" to="/dashboard">
            Dashboard
          </Link>
          <Link className="text-btn" to="/matchboard">
            Browse
          </Link>
        </div>
      </header>

      <main className="form-page">
        <form className="dashboard-card form-card" onSubmit={handleSubmit}>
          <h2>Match details</h2>

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
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Buyer looking in Doylestown up to $650K"
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
              <input
                value={mlsId}
                onChange={(e) => setMlsId(e.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>

          <label>
            Address or Area
            <input
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              placeholder="Full address, neighborhood, town, or general area"
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
                placeholder="Example: $450K-$600K"
              />
            </label>

            <label>
              Property Type
              <input
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                placeholder="Single family, condo, townhome, etc."
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
              <input
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
              />
            </label>
          </div>

          <label>
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="5"
              placeholder="Add timing, buyer preferences, seller motivation, agent instructions, or anything another WRC agent should know."
            />
          </label>

          {errorMsg && <div className="error-box">{errorMsg}</div>}

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Match Post"}
          </button>
        </form>
      </main>
    </div>
  );
}