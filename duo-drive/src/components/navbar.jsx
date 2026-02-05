import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import Logo from "../assets/logo-2.png";
import Logo from "../assets/logo.png";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/inventory", label: "Inventory" },
  { path: "/financing", label: "Financing" },
  { path: "/about", label: "About" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" },
  { path: "/faq", label: "FAQs" },
];

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path) =>
    `relative transition block py-2 ${
      location.pathname === path
        ? "text-[#2fa88a]"
        : "text-white hover:text-[#2fa88a]"
    }`;

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <div className="flex items-center text-2xl md:text-3xl font-extrabold tracking-tight">
          <img
            src={Logo}
            alt="Duo Drive Kenya logo"
            className="h-15 w-20  rounded-2xl"
          />
          {/* <span className="text-white">Duo</span>
          <span className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] bg-clip-text text-transparent">
            Drive
          </span>
          <span className="text-white">Kenya</span> */}
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {/* Simple hamburger icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* LINKS (desktop) */}
        <div className="hidden md:flex space-x-10 font-medium">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} className={linkClass(path)}>
              {label}
              {location.pathname === path && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#2fa88a]" />
              )}
            </Link>
          ))}
        </div>

        {/* CTA (desktop only) */}
        <Link
          to="/login"
          className="hidden md:inline-block bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Login
        </Link>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 px-6 pb-6 space-y-4">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={linkClass(path)}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/login"
            className="block bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
