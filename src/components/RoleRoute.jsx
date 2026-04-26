import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function RoleRoute({ children, allowedRoles = [] }) {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setChecking(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));

        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error loading user role:", err);
        setProfile(null);
      } finally {
        setChecking(false);
      }
    });

    return () => unsub();
  }, []);

  if (checking) {
    return (
      <div className="page-center">
        <div className="card">
          <h2>Loading WRC Matchboard...</h2>
          <p>Checking your access level.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = profile?.role || "agent";

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/agent" replace />;
  }

  return children;
}