import React from "react";
import { MainLayout } from "../main-layout";
import { useNavigate } from "react-router-dom";
import { LoaderComponent } from "../LoaderComponent";
import { NotificationContext } from "../../context/NotificationContext";
import { AuthenticationContext } from "../../context/AuthContext";

export default function RegistFiLeague() {
    const navigate = useNavigate();
    const { accountid } = React.useContext(AuthenticationContext);
    const { setNotificationData } = React.useContext(NotificationContext);

    const [alias, setAlias] = React.useState("");
    const [secret, setSecret] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!alias || !secret) {
            setNotificationData({
                title: "Warning",
                description: "Harap isi semua field sebelum melanjutkan.",
                position: "bottom-right",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("https://godean-backend-api.vercel.app/api/fi-sim/regist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ accId: accountid, name: alias, secret: secret }),
            });

            const data = await response.json();

            if (!response.ok) {
                const message = data?.msg || `HTTP error! Status: ${response.status}`;
                throw new Error(message);
            }

            setNotificationData({
                title: "Success",
                description: "Registrasi berhasil! Kamu siap bermain Finance League!",
                position: "bottom-right",
            });

            setTimeout(() => navigate("/fi-leaguage"), 1500);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            setNotificationData({
                title: "Error",
                description: `Gagal mendaftar: ${errorMessage}`,
                position: "bottom-right",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitting) return <LoaderComponent fullScreen={true} />;

    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center h-[80vh] px-4">
                <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
                    Daftar ke Finance League
                </h1>

                <form
                    onSubmit={handleRegister}
                    className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md border border-gray-200"
                >
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">
                            Nama Alias
                        </label>
                        <input
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            placeholder="Masukkan nama alias kamu"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-1">
                            Secret (Passcode)
                        </label>
                        <input
                            type="password"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            placeholder="Masukkan secret untuk simulasi transaksi"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            * Secret ini digunakan nanti untuk mengkonfirmasi transaksi simulasi.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full background-dark text-white font-semibold py-2 rounded-lg shadow disabled:opacity-70 transition"
                    >
                        {isSubmitting ? "Mendaftar..." : "Daftar Sekarang"}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
}


// nanti disini bisa kaya lanjut pake akun lama by metamask id atau lainnya gt