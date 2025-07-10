import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path for active link highlighting
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    dispatch(authActions.logout()); // Dispatch logout action
    setIsOpen(false); // Close mobile menu on logout
    navigate("/login"); // Redirect to login page
  };

  // Define navigation links based on user authentication and role
  const links = [
    { title: "Home", link: "/" },
    ...(isLoggedIn ? [{ title: "Dashboard", link: "/dashboard" }] : []),
    { title: "Contact Us", link: "/contact-us" },
    ...(isLoggedIn ? [{ title: "Profile", link: "/profile" }] : []),
    // Admin Dashboard link visible only for logged-in admins
    ...(isLoggedIn && role === "admin" ? [{ title: "Admin Dashboard", link: "/admin-dashboard" }] : []),
  ];

  return (
    // Main Navbar Container: Modern background, shadow, and rounded bottom corners
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 px-4 py-3 rounded-b-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Site Title */}
        <div className="flex items-center">
          <img className="h-10 rounded-full shadow-md" src={assets.logo} alt="Rail Watch Logo" />
          <h1 className="text-2xl font-bold text-gray-800 ml-2 drop-shadow-sm">Rail Watch</h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              // Highlight active link based on current path
              className={`text-lg font-medium px-4 py-2 rounded-xl transition-all duration-300
                ${location.pathname === item.link
                  ? 'text-indigo-600 bg-indigo-50/50 shadow-sm' // Active link style
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100/50' // Inactive link style
                }`}
            >
              {item.title}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              {/* Login Button with gradient */}
              <Link
                to="/login"
                className="text-lg px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                           rounded-full font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300"
              >
                Log In
              </Link>
              {/* Sign Up Button with different gradient */}
              <Link
                to="/signup"
                className="text-lg px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white
                           rounded-full font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
          {isLoggedIn && (
            // Logout Button with gradient
            <button
              onClick={handleLogout}
              className="text-lg px-6 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white
                         rounded-full font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300"
            >
              Log Out
            </button>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <img
            src={isOpen ? assets.close : assets.menu} // Assuming assets.close and assets.menu exist
            alt="Menu Icon"
            className="h-8 cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isOpen && (
        <div className="mt-4 bg-gray-800/90 backdrop-blur-sm text-white p-4 rounded-xl lg:hidden shadow-xl">
          <div className="flex flex-col gap-4">
            {links.map((item, i) => (
              <Link
                to={item.link}
                key={i}
                onClick={toggleMenu} // Close menu on link click
                // Active link style for mobile
                className={`text-lg font-medium px-6 py-3 rounded-xl text-center transition-all duration-300
                  ${location.pathname === item.link
                    ? 'bg-indigo-700 shadow-sm' // Active link style
                    : 'hover:bg-indigo-700' // Inactive link hover
                  }`}
              >
                {item.title}
              </Link>
            ))}
            {!isLoggedIn && (
              <>
                {/* Login Button for mobile with gradient */}
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="w-full text-lg px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                             rounded-xl font-semibold text-center hover:shadow-md transition-all duration-300"
                >
                  Log In
                </Link>
                {/* Sign Up Button for mobile with different gradient */}
                <Link
                  to="/signup"
                  onClick={toggleMenu}
                  className="w-full text-lg px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white
                             rounded-xl font-semibold text-center hover:shadow-md transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
            {isLoggedIn && (
              // Logout Button for mobile with gradient
              <button
                onClick={handleLogout}
                className="w-full text-lg px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white
                           rounded-xl font-semibold text-center hover:shadow-md transition-all duration-300"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;