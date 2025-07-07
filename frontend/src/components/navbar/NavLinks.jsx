import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { logout } from "../../utils/logout";

export function NavLinks() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <>
      {user ? (
        <>
          <button onClick={handleLogout} className="btn hover:bg-blue-200 m-1">
            Logout
          </button>

          {user.role === "admin" ? (
            <Link to="/registrations" className="btn hover:bg-blue-200 m-1">
              All Registrations
            </Link>
          ) : (
            <Link to="/myservices" className="btn hover:bg-blue-200 m-1">
              My Procedures
            </Link>
          )}
        </>
      ) : (
        <>
          <Link to="/login" className="btn hover:bg-blue-200 m-1">
            Login
          </Link>
          <Link to="/signup" className="btn hover:bg-blue-200 m-1">
            Signup
          </Link>
        </>
      )}
    </>
  );
}
