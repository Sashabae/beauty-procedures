import { Link } from "react-router";
import { NavLinks } from "./NavLinks";
import { MobileNavLinks } from "./MobileNavLinks";

export default function Header() {
  // Close drawer on clicking a link
  const closeDrawer = (e) => {
    if (e.target.tagName === "A") {
      document.getElementById("my-drawer").checked = false;
    }
  };
  return (
    <div className="drawer drawer-end">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <header>
          <nav className="navbar bg-base-300 shadow-sm px-4 flex justify-between items-center">
            {/* Logo */}
            <Link to="/services" className="flex gap-1 items-center text-xl px-2 btn hover:bg-blue-200">
              <img src="/beauty.svg" alt="lipstick icon" className="w-8" />
              Procedures
            </Link>

            {/* Mobile Hamburger Nav */}
            <div className="md:hidden">
              <label
                htmlFor="my-drawer"
                className="btn btn-square bg-base-200 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavLinks />
            </div>
          </nav>
        </header>
      </div>

      {/* Mobile Drawer */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul
          onClick={closeDrawer}
          className="menu p-4 w-60 min-h-full bg-base-300 rounded-b-2xl rounded-t-2xl"
        >
          <MobileNavLinks />
        </ul>
      </div>
    </div>
  );
}
