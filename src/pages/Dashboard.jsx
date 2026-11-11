
import { useState } from "react";
import { Link } from "react-router-dom";
import InternshipCard from "../components/InternshipCard";

function Dashboard({ internships, onDeleteInternship, loading }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Step 1: Data load hone tak loading state show karenge
  if (loading) {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <p className="api-message">Loading your internships...</p>
      </div>
    );
  }

  // Step 2: Upcoming 3 deadlines calculate karna
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingInternships = internships
    .filter((internship) => {
      if (!internship.deadline) return false;

      const deadlineDate = new Date(
        `${internship.deadline.slice(0, 10)}T00:00:00`
      );

      return deadlineDate >= today;
    })
    .sort(
      (a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
    )
    .slice(0, 3);

  // Step 3: Search aur status filter
  const filteredInternships = internships
    .filter((internship) => {
      const company = internship.company || "";
      const role = internship.role || "";

      const matchesSearch =
        company.toLowerCase().includes(search.toLowerCase()) ||
        role.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        internship.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;

      return new Date(a.deadline) - new Date(b.deadline);
    });

  // Step 4: Kya user ne koi search/filter apply kiya hai?
  const hasActiveFilter =
    search.trim() !== "" || statusFilter !== "All";

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track your internship applications.</p>
        </div>

        <Link to="/add-internship">
          <button className="add-button">
            + Add Internship
          </button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card">
          <h2>{internships.length}</h2>
          <p>Total Applications</p>
        </div>

        <div className="stat-card">
          <h2>
            {internships.filter(
              (internship) => internship.status === "Interview"
            ).length}
          </h2>
          <p>Interviews</p>
        </div>

        <div className="stat-card">
          <h2>
            {internships.filter(
              (internship) => internship.status === "Selected"
            ).length}
          </h2>
          <p>Selected</p>
        </div>

        <div className="stat-card">
          <h2>
            {internships.filter(
              (internship) => internship.status === "Rejected"
            ).length}
          </h2>
          <p>Rejected</p>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="upcoming-section">
        <h2>Upcoming Deadlines</h2>

        {internships.length === 0 ? (
          <p>Add an internship to track its deadline.</p>
        ) : upcomingInternships.length === 0 ? (
          <p>No upcoming deadlines. You're all caught up!</p>
        ) : (
          upcomingInternships.map((internship) => (
            <div className="upcoming-item" key={internship._id}>
              <div>
                <h3>{internship.company}</h3>
                <p>{internship.role}</p>
              </div>

              <span>
                {new Date(internship.deadline).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC"
                  }
                )}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Recent Applications */}
      <div className="recent-section">
        <h2>Recent Applications</h2>

        {/* Search + Filter */}
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All</option>
            <option>Applied</option>
            <option>Shortlisted</option>
            <option>Interview</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* Internship Cards / Empty State */}
        {internships.length === 0 ? (
          <div className="empty-state">
            <h3>No internships yet</h3>
            <p>
              Start tracking your applications by adding your first
              internship.
            </p>
            <Link to="/add-internship">
              <button className="add-button">
                + Add Your First Internship
              </button>
            </Link>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="empty-state">
            <h3>
              {hasActiveFilter
                ? "No matching internships"
                : "No internships found"}
            </h3>
            <p>
              {hasActiveFilter
                ? "Try another company name or change the status filter."
                : "Add an internship to get started."}
            </p>

            {hasActiveFilter && (
              <button
                className="secondary-button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredInternships.map((internship) => (
            <InternshipCard
              key={internship._id}
              _id={internship._id}
              company={internship.company}
              role={internship.role}
              location={internship.location}
              status={internship.status}
              deadline={internship.deadline}
              notes={internship.notes}
              applicationLink={internship.applicationLink}
              onDelete={() =>
                onDeleteInternship(internship._id)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
