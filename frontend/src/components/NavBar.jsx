import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    
    
    return (
        <nav className="bg-blue-600 dark:bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-md sticky top-0 z-50 transition-colors duration-300">
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
            className={`flex-col md:flex md:flex-row md:items-center absolute md:static bg-blue-600 dark:bg-gray-800 left-0 w-full md:w-auto transition-all duration-300 ease-in-out ${
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
                    className="block px-4 py-2 hover:bg-blue-700 dark:hover:bg-gray-700 md:hover:bg-transparent md:hover:text-gray-200 transition"
                >
                    Dashboard
                </Link>

                <Link
                    to="/meals"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-blue-700 md:hover:bg-transparent md:hover:text-gray-200 transition"
                >
                    Meals
                </Link>

                <Link
                    to="/mood-trends"
                    className="hover:text-blue-500 transition-colors duration-200"
                >
                    Mood & Energy
                </Link>

                <button
                onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                }}
                className="px-4 py-2 rounded-md font-medium text-white transition bg-transparent border border-transparent hover:bg-red-500 hover:border-red-500"
                >
                Logout
                </button>

                <button
                onClick={() => setDarkMode(!darkMode)}
                className="ml-4 p-2 rounded-md bg-blue-500 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                title="Toggle dark mode"
                >
                {darkMode ? "☀️" : "🌙"}
                </button>
            </>
            ) : (
            <>
                <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-blue-700 dark:hover:bg-gray-700 md:hover:bg-transparent md:hover:text-gray-200 transition"
                >
                Login
                </Link>
                <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 hover:bg-blue-700 dark:hover:bg-gray-700 md:hover:bg-transparent md:hover:text-gray-200 transition"
                >
                Register
                </Link>

                <button
                onClick={() => setDarkMode(!darkMode)}
                className="ml-4 p-2 rounded-md bg-blue-500 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                title="Toggle dark mode"
                >
                {darkMode ? "☀️" : "🌙"}
                </button>
            </>
            )}
        </div>
        </nav>
    );
};

export default Navbar;