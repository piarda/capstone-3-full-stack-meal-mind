import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    
    return (
        <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md sticky top-0 z-50">
            <Link
                to="/"
                className="text-2xl font-bold hover:text-gray-200 transition-colors"
            >
                MealMind
            </Link>

            <button
                className="md:hidden text-white focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? (
                <span className="text-2xl">&times;</span>
                ) : (
                <span className="text-2xl">&#9776;</span>
                )}
            </button>

            <div
                className={`flex-col md:flex md:flex-row md:items-center absolute md:static bg-blue-600 left-0 w-full md:w-auto transition-all duration-300 ease-in-out ${
                menuOpen ? "top-14" : "top-[-400px]"
                } md:top-0`}
            >
                {user ? (
                <>
                    <span className="block px-4 py-2 md:mr-4 md:ml-2 text-white font-medium">
                    Welcome, {user.username}!
                    </span>

                    <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-blue-700 md:hover:bg-transparent md:hover:text-gray-200 transition"
                    >
                    Dashboard
                    </Link>
                    <button
                    onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 md:bg-transparent md:hover:bg-transparent md:hover:text-red-300 transition"
                    >
                    Logout
                    </button>
                </>
                ) : (
                <>
                    <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-blue-700 md:hover:bg-transparent md:hover:text-gray-200 transition"
                    >
                    Login
                    </Link>
                    <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-blue-700 md:hover:bg-transparent md:hover:text-gray-200 transition"
                    >
                    Register
                    </Link>
                </>
                )}
            </div>
        </nav>
    );    
};

export default Navbar;
