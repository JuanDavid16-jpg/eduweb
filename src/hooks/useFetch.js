import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const fetchData = async (endpoint, config) => {
    const response = await fetch(process.env.NEXT_PUBLIC_APP_DOMAIN + "/api" + endpoint, {
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
        },
        method: "GET",
        ...config,
    });
    const data = await response.json();

    return data;
};

export const useGetData = (endpoint) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const { data, ...rest } = await fetchData(endpoint);
                setData(data);
                setTotal(rest?.total);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [trigger, endpoint]);

    const reload = () => setTrigger((prev) => prev + 1);

    return {
        data,
        error,
        loading,
        total,
        reload,
    };
};

export const usePutData = async (endpoint, body) => {
    const { success, data, message } = await fetchData(endpoint, {
        method: "PUT",
        body: JSON.stringify(body),
    });

    if (!success)
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        });
    else
        Swal.fire({
            title: "Éxito",
            text: message,
            icon: "success",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        });

    return { success, data, message };
};

export const usePostData = async (endpoint, body) => {
    const { success, data, message } = await fetchData(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
    });

    if (!success)
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        });
    else
        Swal.fire({
            title: "Éxito",
            text: message,
            icon: "success",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        });

    return { success, data, message };
};

export const useDeleteData = async (endpoint) => {
    const { success, data, message } = await fetchData(endpoint, {
        method: "DELETE",
    });

    if (!success)
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        });
    else
        Swal.fire({
            title: "Éxito",
            text: message,
            icon: "success",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        });

    return { success, data, message };
};

export const getData = async (endpoint, alert = true) => {
    const { success, data, message } = await fetchData(endpoint);

    if (!success && alert)
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        });
    else if (success && alert)
        Swal.fire({
            title: "Éxito",
            text: message,
            icon: "success",
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
        });

    return { success, data, message };
};
