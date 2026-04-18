import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import VerifyEmail from "../pages/VerifyEmail";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import UserProfile from "../pages/UserProfile";
import ProtectedRoute from "../components/ProtectedRoute";
import Roommates from "../pages/Roommates";
import BrowseRooms from "../pages/BrowseRooms";
import DashboardHome from "../pages/DashboardHome";

export default function AppRoutes() {
  return (
    <Routes>
      
      <Route path="/" element={<LoginPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ✅ DASHBOARD WITH NESTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
       
         <Route index element={<DashboardHome />} />
           <Route path="roommates" element={<Roommates />} />
        <Route path="profile" element={<Profile />} />
        <Route path="browse" element={<BrowseRooms />} />
      </Route>

      {/* ✅ USER PROFILE */}
      <Route
        path="/user/:username"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}