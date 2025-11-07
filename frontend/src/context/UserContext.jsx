import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
            const data = await api.get("/user/me");
            setUser(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to load user data");
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const refreshUser = async () => {
        await fetchUser();
    };

    return (
        <UserContext.Provider value={{ user, setUser, loadingUser, error, refreshUser }}>
        {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
