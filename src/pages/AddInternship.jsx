
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getInternships,
  addInternship,
  updateInternship
} from "../api";

function AddInternship({ onSaved }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Applied");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [applicationLink, setApplicationLink] = useState("");

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Edit mode: existing internship API se load karo
  useEffect(() => {
    if (!isEditMode) return;

    async function fetchInternship() {
      try {
        setLoading(true);
        setError("");

        const internships = await getInternships();

        const internship = internships.find(
          (item) => item._id === id
        );

        if (!internship) {
          throw new Error("Internship not found");
        }

        setCompany(internship.company || "");
        setRole(internship.role || "");
        setLocation(internship.location || "");
        setStatus(internship.status || "Applied");

        setDeadline(
          internship.deadline
            ? String(internship.deadline).slice(0, 10)
            : ""
        );

        setNotes(internship.notes || "");
        setApplicationLink(internship.applicationLink || "");
      } catch (err) {
        setError(err.message || "Failed to load internship.");
      } finally {
        setLoading(false);
      }
    }

    fetchInternship();
  }, [id, isEditMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!company.trim()) {
      setError("Please enter the company name.");
      return;
    }

    if (!role.trim()) {
      setError("Please enter the internship role.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter the location.");
      return;
    }

    if (!deadline) {
      setError("Please select the application deadline.");
      return;
    }

    const internship = {
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      status,
      deadline,
      notes: notes.trim(),
      applicationLink: applicationLink.trim()
    };

    try {
      setSaving(true);

      if (isEditMode) {
        await updateInternship(id, internship);
      } else {
        await addInternship(internship);
      }

        const message = isEditMode
        ? "Internship updated successfully!"
        : "Internship added successfully!";

      // Dashboard ki React state latest data se update karo
      await onSaved(message);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to save internship.");
    } finally {
      setSaving(false);
    }
  }

  if (loading && isEditMode) {
    return <p>Loading internship...</p>;
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>
          {isEditMode ? "Edit Internship" : "Add Internship"}
        </h1>

        <p>
          {isEditMode
            ? "Update your internship application."
            : "Add a new internship application."}
        </p>

        {error && (
          <p role="alert" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="e.g. Google"
              required
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <input
              type="text"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="e.g. Frontend Developer Intern"
              required
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g. Remote"
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option>Applied</option>
              <option>Shortlisted</option>
              <option>Interview</option>
              <option>Selected</option>
              <option>Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Application Deadline *</label>
            <input
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add important notes..."
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Application Link</label>
            <input
              type="url"
              value={applicationLink}
              onChange={(event) =>
                setApplicationLink(event.target.value)
              }
              placeholder="https://example.com/internship"
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Add Internship"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddInternship;
