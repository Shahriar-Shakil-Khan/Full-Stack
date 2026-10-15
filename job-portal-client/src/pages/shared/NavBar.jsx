import { use } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import useRole, { clearRoleCache } from "../../hooks/useRole"; // নতুন: role জানার জন্য

export default function NavBar() {
  const { user, logOut } = use(AuthContext);
  // নতুন: login করা user এর role
  const { role } = useRole();

  const handleSignOut = () => {
    // logout এর সময় role cache মুছে দিই
    clearRoleCache(user?.email);
    logOut()
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const links = (
    <>
      <NavLink to="/">
        <li className="m-2">Home</li>
      </NavLink>

      {/* login করা সবাই dashboard দেখবে (role অনুযায়ী আলাদা dashboard খুলবে) */}
      {user && (
        <NavLink to="/dashboard">
          <li className="m-2">Dashboard</li>
        </NavLink>
      )}

      {/* শুধু applicant এর জন্য */}
      {role === "applicant" && (
        <NavLink to="/myApplications">
          <li className="m-2">My Applications</li>
        </NavLink>
      )}

      {/* শুধু recruiter এর জন্য */}
      {role === "recruiter" && (
        <>
          <NavLink to="/addJob">
            <li className="m-2">Add Job</li>
          </NavLink>
          <NavLink to="/myPostedJobs">
            <li className="m-2">Posted Jobs</li>
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                aria-label="Menu"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>
        <div className="navbar-end">
          {user ? (
            <button onClick={handleSignOut} className="btn">
              Sign Out
            </button>
          ) : (
            <>
              <NavLink to="/register" className="btn">
                Register
              </NavLink>
              <NavLink to="/signIn" className="btn">
                Sign In
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}