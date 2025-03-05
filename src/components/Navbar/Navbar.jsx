import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(authActions.logout());
    setIsOpen(false);
    navigate("/login");
  };

  const links = [
    { title: "Home", link: "/" },
    ...(isLoggedIn ? [{ title: "Dashboard", link: "/dashboard" }] : []),
    { title: "Contact Us", link: "/contact-us" },
    ...(isLoggedIn ? [{ title: "Profile", link: "/profile" }] : []),
    ...(isLoggedIn && role === "admin" ? [{ title: "Admin Dashboard", link: "/admin-dashboard" }] : []), // ✅ Visible only for logged-in admins
  ];

  return (
    <div className="bg-gray-200 text-gray-800 px-8 py-4 rounded-b-lg shadow-lg">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img className="h-10 rounded-full" src={assets.logo} alt="Logo" />
          <h1 className="text-2xl font-semibold ml-2">Rail Watch</h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex gap-6">
          {links.map((item, i) => (
            <Link
              to={item.link}
              className="text-lg px-4 py-2 hover:text-green-600 rounded-full transition-all duration-300"
              key={i}
            >
              {item.title}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              <Link to="/login" className="text-lg px-6 py-2 border border-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300">
                Log In
              </Link>
              <Link to="/signup" className="text-lg px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300">
                Sign Up
              </Link>
            </>
          )}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-lg px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300"
            >
              Log Out
            </button>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <img
            src={isOpen ? assets.close : assets.menu}
            alt="Menu Icon"
            className="h-8 cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-4 bg-gray-600 text-white p-4 rounded-lg lg:hidden shadow-md">
          <div className="flex flex-col gap-4">
            {links.map((item, i) => (
              <Link
                to={item.link}
                className="text-lg px-6 py-2 hover:bg-green-500 rounded-full text-center transition-all duration-300"
                key={i}
                onClick={toggleMenu}
              >
                {item.title}
              </Link>
            ))}
            {!isLoggedIn && (
              <>
                <Link to="/login" className="w-full text-lg px-6 py-2 border border-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 text-center" onClick={toggleMenu}>
                  Log In
                </Link>
                <Link to="/signup" className="w-full text-lg px-6 py-2 bg-green-500 rounded-full hover:bg-green-600 transition-all duration-300 text-center" onClick={toggleMenu}>
                  Sign Up
                </Link>
              </>
            )}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full text-lg px-6 py-2 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-300 text-center"
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
