import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">Campus Connect</Link>
      <nav>
        {user ? (
          <>
            <Link to={user.role === "admin" ? "/admin" : "/student"}>Dashboard</Link>
            <span className="nav-user">{user.name}</span>
            <button className="btn btn-small btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link className="btn btn-small" to="/register">Get Started</Link>
          </>
        )}
      </nav>
    </header>
  );
}
