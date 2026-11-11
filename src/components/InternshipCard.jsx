
import { useState } from "react";
import { Link } from "react-router-dom";

function InternshipCard({
  _id,
  company,
  role,
  location,
  status,
  deadline,
  notes,
  applicationLink,
  onDelete
}) {
  const [deleting, setDeleting] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = deadline
    ? new Date(`${deadline.slice(0, 10)}T00:00:00`)
    : null;

  const difference = deadlineDate
    ? deadlineDate.getTime() - today.getTime()
    : null;

  const daysLeft = difference === null
    ? null
    : Math.round(difference / (1000 * 60 * 60 * 24));

  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
      })
    : "Not specified";

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${company}?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await onDelete();
    } catch (error) {
      alert(error.message || "Could not delete internship.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="internship-card">
      <div className="card-header">
        <div>
          <h2>{company}</h2>
          <p>{role}</p>
        </div>

        <span className={`status-badge ${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <p>Location: {location || "Not specified"}</p>
      <p>Deadline: {formattedDeadline}</p>

      {notes && <p>Notes: {notes}</p>}

      {applicationLink && (
        <p>
          <a
            href={applicationLink}
            target="_blank"
            rel="noreferrer"
          >
            View Application
          </a>
        </p>
      )}

      {deadline && daysLeft < 0 && (
        <p className="deadline-warning">⚠ Deadline Passed</p>
      )}

      {deadline && daysLeft === 0 && (
        <p className="deadline-today">⚠ Due Today</p>
      )}

      {deadline && daysLeft > 0 && (
        <p className="deadline-left">⏳ {daysLeft} days left</p>
      )}

      <div className="card-actions">
        <Link to={`/internship/${_id}`}>
          <button>View Details</button>
        </Link>

        <Link to={`/edit-internship/${_id}`}>
          <button>Edit</button>
        </Link>

        <button onClick={handleDelete} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default InternshipCard;
