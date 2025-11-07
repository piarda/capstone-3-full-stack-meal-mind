import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Meals from "./pages/Meals";
import MoodTrends from "./pages/MoodTrends";
import Goals from "./pages/Goals"

import "./styles/index.css";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading)
      return (
        <div className="flex justify-center items-center h-screen text-xl">
          Loading...
        </div>
      );

    return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Goals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meals"
              element={
                <ProtectedRoute>
                  <Meals />
                </ProtectedRoute>
              }
            />
            <Route path="/mood-trends" element={<MoodTrends />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
