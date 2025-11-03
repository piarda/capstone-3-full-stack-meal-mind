const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5555/api";

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const config = { ...options, headers };

    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!res.ok) {
        const error = await res.json().catch(() => ({ msg: res.statusText }));
        throw new Error(error.msg || "Request failed");
    }

    return res.json();
}

export const api = {
    get: (endpoint) => request(endpoint, { method: "GET" }),
    post: (endpoint, data) =>
        request(endpoint, { method: "POST", body: JSON.stringify(data) }),
    put: (endpoint, data) =>
        request(endpoint, { method: "PUT", body: JSON.stringify(data) }),
    delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

export default api;
