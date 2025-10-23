/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { AuthenticationContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";

interface SelfCheckResult {
    isLoading: boolean;
    error: string | null;
    registered: boolean | null;
    alias: string | null;
}

/**
 * Hook untuk melakukan self-check akun FiSim.
 * Mengembalikan status loading, error, apakah user terdaftar, dan alias.
 */
export function useSelfCheck(): SelfCheckResult {
    const { isLoggedIn, accountid } = React.useContext(AuthenticationContext);
    const { setNotificationData } = React.useContext(NotificationContext);

    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [registered, setRegistered] = React.useState<boolean | null>(null);
    const [alias, setAlias] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function fetchData() {
            if (!accountid) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(
                    "https://godean-backend-api.vercel.app/api/fi-sim/self-check",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ accId: accountid }),
                    }
                );

                const data = await response.json();

                if (response.status === 200 && data?.data?.name) {
                    // ✅ User ditemukan
                    setAlias(data.data.name);
                    setRegistered(true);
                    setError(null);
                } else if (response.status === 404) {
                    // 📝 Belum terdaftar
                    setAlias(null);
                    setRegistered(false);
                    setError(null);
                } else {
                    // ❌ Error lain
                    const message =
                        data?.msg || `Unexpected server error (${response.status})`;
                    setError(message);
                    setRegistered(null);
                    setNotificationData({
                        title: "Error",
                        description: `Gagal memverifikasi akun: ${message}`,
                        position: "bottom-right",
                    });
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Unknown error occurred";
                setError(errorMessage);
                setNotificationData({
                    title: "Error",
                    description: `Terjadi kesalahan saat memeriksa akun: ${errorMessage}`,
                    position: "bottom-right",
                });
            } finally {
                setIsLoading(false);
            }
        }

        // Hanya jalankan kalau user sudah login
        if (isLoggedIn) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [accountid, isLoggedIn]);

    return { isLoading, error, registered, alias };
}
