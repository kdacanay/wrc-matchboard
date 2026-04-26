import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsub();
  }, []);

  if (checkingAuth) {
    return (
      <div className="page-center">
        <div className="card">
          <h2>Loading WRC Matchboard...</h2>
          <p>Please wait while we check your login.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}