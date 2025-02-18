import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo3.png";
import { Link } from "react-router-dom";
import { useAuth } from "../redux/auth";
import { useProduct } from "../redux/Productprovider";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const { cart, clearcart } = useProduct();
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = cart.reduce((total, item) => total + item.qty, 0);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="py-3 shadow-lg">
        <div className="flex justify-between items-center relative">
          {/* Left part navbar */}
          <div className="flex items-center gap-5">
            <Link to="/">
              <img src={logo} className="max-w-50" alt="Logo" />
            </Link>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden sm:flex gap-4 items-center pr-8 font-medium">
            <Link to="/cart" className="cursor-pointer flex gap-2 relative text-3xl">
              🛒
              {totalItems > 0 && (
                <div className="text-white text-sm bg-green-700 rounded-full px-2 absolute -top-1 right-3">
                  {totalItems}
                </div>
              )}
            </Link>
            <Link to="/orders" className="bg-amber-400 rounded text-white px-1 cursor-pointer text-sm md:text-lg">
              My Order
            </Link>
            {auth?.username && (
              <h1 className="bg-amber-400 rounded text-white px-3 cursor-pointer text-lg">
                {auth.username}
              </h1>
            )}
            {auth?.isAdmin === true && (
              <Link to="/admin" className="bg-amber-400 rounded text-white px-3 cursor-pointer text-lg">
                Admin
              </Link>
            )}
            {auth?.token ? (
              <button onClick={logout} className="bg-amber-400 rounded text-white px-2 cursor-pointer text-lg">
                Logout
              </button>
            ) : (
              <Link to="/login" className="bg-green-700 rounded text-white px-2 cursor-pointer text-lg">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Navbar */}
          <button className="sm:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="sm:hidden absolute top-12 right-0 min-w-[15%] shadow-2xl drop-shadow-2xl bg-white rounded px-4 flex flex-col gap-5 justify-between py-5 font-semibold"
            >
              <Link to="/cart" className="cursor-pointer flex gap-2 relative text-3xl">
                <h1 className="bg-amber-400 rounded text-white w-full px-3 cursor-pointer text-lg">🛒 My Cart</h1>
                {totalItems > 0 && (
                  <div className="text-white text-sm bg-green-700 rounded-full px-2 absolute -top-1 right-3">
                    {totalItems}
                  </div>
                )}
              </Link>
              <Link to="/orders" className="bg-amber-400 rounded text-white px-1 cursor-pointer text-lg md:text-lg">
                My Order
              </Link>
              {auth?.username && (
                <h1 className="bg-amber-400 rounded text-white px-3 cursor-pointer text-lg">
                  {auth.username}
                </h1>
              )}
              {auth?.isAdmin === true && (
                <Link to="/admin" className="bg-amber-400 rounded text-white px-3 cursor-pointer text-lg">
                  Admin
                </Link>
              )}
              {auth?.token ? (
                <button onClick={logout} className="bg-amber-400 rounded text-white px-2 cursor-pointer text-lg">
                  Logout
                </button>
              ) : (
                <Link to="/login" className="bg-green-700 rounded text-white px-2 cursor-pointer text-lg">
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
