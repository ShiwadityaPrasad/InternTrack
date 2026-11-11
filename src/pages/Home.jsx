import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <h1>Welcome to InternTrack</h1>

      <p>
        Manage and track all your internship
        applications in one place.
      </p>

      <Link to="/dashboard">
        <button>
          Get Started
        </button>
      </Link>
    </main>
  );
}

export default Home;