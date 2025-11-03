import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await api.get("/auth/me");
            setUser(data);
        } catch (err) {
            console.error("Error loading user:", err);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        const data = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.access_token);
        setUser(data.user || { username: data.username, email: data.email });
    };

    const register = async (username, email, password) => {
        const data = await api.post("/auth/register", { username, email, password });
        localStorage.setItem("token", data.access_token);
        setUser(data.user || { username: data.username, email: data.email });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
