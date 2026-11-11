import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ onLogout }) {
  const navigate = useNavigate();

  const { token, user, logout } = useAuth();

  function handleLogout() {
  logout();

  if (onLogout) {
    onLogout();
  }

  navigate("/login");
}

  return (
    <nav>
      <h2>
        <Link to="/">InternTrack</Link>
      </h2>

      <div>
        <Link to="/">Home</Link>

        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>

            <span>
              Welcome, {user?.name}
            </span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;