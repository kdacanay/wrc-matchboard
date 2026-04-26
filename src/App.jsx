import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import CreateMatchPost from "./pages/CreateMatchPost";
import MatchBoard from "./pages/MatchBoard";
import MyPosts from "./pages/MyPosts";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import "./index.css";
import EditMatchPost from "./pages/EditMatchPost";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/agent"
          element={
            <RoleRoute allowedRoles={["agent", "admin"]}>
              <AgentDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/create"
          element={
            <RoleRoute allowedRoles={["agent", "admin"]}>
              <CreateMatchPost />
            </RoleRoute>
          }
        />

        <Route
          path="/matchboard"
          element={
            <RoleRoute allowedRoles={["agent", "admin"]}>
              <MatchBoard />
            </RoleRoute>
          }
        />

        <Route
          path="/my-posts"
          element={
            <RoleRoute allowedRoles={["agent", "admin"]}>
              <MyPosts />
            </RoleRoute>
          }
        />

        <Route
  path="/edit/:postId"
  element={
    <RoleRoute allowedRoles={["agent", "admin"]}>
      <EditMatchPost />
    </RoleRoute>
  }
/>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}