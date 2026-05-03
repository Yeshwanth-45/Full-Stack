import { api } from "./api";

export const loginRequest = async (email, password) => {
    const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error(await res.text());

    return await res.json(); // expect { token }
};

export const registerRequest = async (email, password) => {
    const res = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error(await res.text());

    return await res.json();
};
