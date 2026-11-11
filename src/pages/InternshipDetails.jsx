
import { Link, useParams } from "react-router-dom";

function InternshipDetails({ internships, loading }) {
  const { id } = useParams();

  const internship = internships.find(
    (item) => item._id === id
  );

  // API se data abhi load ho raha hai
  if (loading) {
    return (
      <div className="details-page">
        <div className="details-card">
          <h2>Loading internship details...</h2>
          <p>Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  // Loading complete hone ke baad bhi internship nahi mili
  if (!internship) {
    return (
      <div className="details-page">
        <div className="details-card">
          <h2>Internship not found</h2>
          <p>
            The internship may have been deleted or the link may be invalid.
          </p>

          <Link to="/dashboard">
            <button className="primary-button">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDeadline = internship.deadline
    ? new Date(internship.deadline).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "UTC"
        }
      )
    : "Not specified";

  return (
    <div className="details-page">
      <div className="details-header">
        <div>
          <h1>{internship.company}</h1>
          <p>{internship.role}</p>
        </div>

        <Link to="/dashboard">
          <button className="secondary-button">
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div className="details-card">
        <h2>Internship Details</h2>

        <div className="detail-row">
          <span>Company</span>
          <strong>{internship.company}</strong>
        </div>

        <div className="detail-row">
          <span>Role</span>
          <strong>{internship.role}</strong>
        </div>

        <div className="detail-row">
          <span>Location</span>
          <strong>{internship.location || "Not specified"}</strong>
        </div>

        <div className="detail-row">
          <span>Status</span>
          <span
            className={`status-badge ${(internship.status || "Applied").toLowerCase()}`}
          >
            {internship.status || "Applied"}
          </span>
        </div>

        <div className="detail-row">
          <span>Deadline</span>
          <strong>{formattedDeadline}</strong>
        </div>

        <div className="detail-row">
          <span>Notes</span>
          <strong>{internship.notes || "No notes added"}</strong>
        </div>

        {internship.applicationLink && (
          <div className="detail-row">
            <span>Application</span>
            <a
              href={internship.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Application →
            </a>
          </div>
        )}

        <div className="details-actions">
          <Link to={`/edit-internship/${internship._id}`}>
            <button className="primary-button">
              Edit Internship
            </button>
          </Link>

          <Link to="/dashboard">
            <button className="secondary-button">
              Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InternshipDetails;
