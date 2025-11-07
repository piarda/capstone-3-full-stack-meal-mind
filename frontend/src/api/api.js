const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5555/api";

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const config = { ...options, headers };

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, config);

        if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message =
            errorData?.msg ||
            errorData?.message ||
            res.statusText ||
            "Request failed";
        throw new Error(message);
        }

        if (res.status === 204) return null;

        const data = await res.json().catch(() => ({}));
        return data;
    } catch (err) {
        console.error(`API Error [${options.method || "GET"} ${endpoint}]:`, err);
        throw err;
    }
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
