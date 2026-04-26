import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [targetRoute, setTargetRoute] = useState("/agent");

  useEffect(() => {
    async function routeByRole() {
      if (!auth.currentUser) {
        setTargetRoute("/login");
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));

        if (snap.exists() && snap.data()?.role === "admin") {
          setTargetRoute("/admin");
        } else {
          setTargetRoute("/agent");
        }
      } catch (err) {
        console.error("Error routing by role:", err);
        setTargetRoute("/agent");
      } finally {
        setLoading(false);
      }
    }

    routeByRole();
  }, []);

  if (loading) {
    return (
      <div className="page-center">
        <div className="card">
          <h2>Loading your dashboard...</h2>
          <p>Taking you to the right Matchboard view.</p>
        </div>
      </div>
    );
  }

  return <Navigate to={targetRoute} replace />;
}