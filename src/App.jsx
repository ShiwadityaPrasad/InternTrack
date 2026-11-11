import { AuthProvider } from "./context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddInternship from "./pages/AddInternship";
import InternshipDetails from "./pages/InternshipDetails";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  getInternships as fetchInternships,
  deleteInternship as removeInternship
} from "./api";

function App() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // MongoDB se latest internships load karna
  const loadInternships = useCallback(async () => {
  try {
    setError("");

    const data = await fetchInternships();
    setInternships(data);

    return data;
  } catch (err) {
    setError(err.message || "Could not load internships.");
    throw err;
  } finally {
    setLoading(false);
  }
}, []);

  // Add/Edit ke baad data reload aur success message
async function handleSaved(message) {
  await loadInternships();
  setSuccessMessage(message);
}

// Success message 4 seconds baad hide hoga
useEffect(() => {
  if (!successMessage) return;

  const timer = setTimeout(() => {
    setSuccessMessage("");
  }, 4000);

  return () => clearTimeout(timer);
}, [successMessage]);

  // App start hone par data fetch karo
useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    loadInternships().catch(() => {});
  } else {
    setLoading(false);
  }
}, [loadInternships]);

  // Delete internship
  async function deleteInternship(id) {
    try {
      setError("");
      setSuccessMessage("");

      await removeInternship(id);

      setInternships((previous) =>
        previous.filter((internship) => internship._id !== id)
      );

      setSuccessMessage("Internship deleted successfully!");
    } catch (err) {
      setError(err.message || "Could not delete internship.");
      throw err;
    }
  }

  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar
        onLogout={() => {
        setInternships([]);
        setError("");
        setSuccessMessage("");
        }}
      />

      {loading && (
        <p className="api-message">
          Loading internships...
        </p>
      )}

      {error && (
        <p className="api-error" role="alert">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="api-success" role="status">
          {successMessage}
        </p>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login onLogin={loadInternships} />}
          />
        <Route path="/register" element={<Register />} />

      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard
        internships={internships}
        onDeleteInternship={deleteInternship}
        loading={loading}
      />
    </ProtectedRoute>
  }
/>

<Route
  path="/internship/:id"
  element={
    <ProtectedRoute>
      <InternshipDetails
        internships={internships}
        loading={loading}
      />
    </ProtectedRoute>
  }
/>

<Route
  path="/add-internship"
  element={
    <ProtectedRoute>
      <AddInternship onSaved={handleSaved} />
    </ProtectedRoute>
  }
/>

<Route
  path="/edit-internship/:id"
  element={
    <ProtectedRoute>
      <AddInternship onSaved={handleSaved} />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
