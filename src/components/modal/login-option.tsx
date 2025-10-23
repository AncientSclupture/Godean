import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { AuthenticationContext } from "../../context/AuthContext";
import { X, Wallet, Mail, User } from "lucide-react";

enum LoginOption {
    wallet = "wallet",
    manualid = "manualid",
    google = "google",
}

export default function ModalLoginOption() {
    const { setModalKind } = React.useContext(ModalContext);
    const { manualLogin, login } = React.useContext(AuthenticationContext);

    const [loginOption, setLoginOption] = React.useState<LoginOption | null>(null);
    const [inputId, setInputId] = React.useState("");

    function handleClose() {
        setModalKind(null);
        setLoginOption(null);
        setInputId("");
    }

    function handleSelect(option: LoginOption) {
        setLoginOption(option);
        if (option === LoginOption.wallet) setInputId("");
    }

    function handleManualLogin() {
        if (!inputId.trim()) return;
        manualLogin(inputId.trim());
        handleClose();
    }

    function handleWalletLogin() {
        login();
        handleClose();
    }

    function handleGoogleLogin() {
        handleClose();
    }

    return (
        <div className="bg-white rounded-2xl shadow-md max-w-md w-[90vw] md:w-[400px] max-h-[85vh] relative animate-fadeIn flex flex-col">
            {/* Tombol close */}
            <button
                onClick={handleClose}
                className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition"
            >
                <X size={16} />
            </button>

            {/* Konten */}
            <div className="p-6 space-y-5 overflow-y-auto no-scrollbar">
                {/* Header */}
                <div className="text-center space-y-1">
                    <h2 className="text-xl font-semibold text-gray-800">Masuk ke Aplikasi</h2>
                    <p className="text-sm text-gray-500">
                        Pilih metode login yang kamu inginkan. ID atau wallet kamu akan digunakan
                        sebagai <span className="font-medium text-gray-700">identifier unik</span> untuk akunmu.
                    </p>
                </div>

                {/* Tombol Login Atas (Metamask + Google) */}
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSelect(LoginOption.wallet)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 transition"
                    >
                        <Wallet size={18} /> Metamask
                    </button>

                    <button
                        onClick={() => handleSelect(LoginOption.google)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 transition"
                    >
                        <Mail size={18} /> Google
                    </button>
                </div>

                {/* Aksi Login */}
                {loginOption === LoginOption.wallet && (
                    <div className="text-center text-sm text-gray-600">
                        Menghubungkan wallet...
                        <div className="mt-2">
                            <button
                                onClick={handleWalletLogin}
                                className="px-4 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-800 text-white transition"
                            >
                                Hubungkan Wallet
                            </button>
                        </div>
                    </div>
                )}

                {loginOption === LoginOption.google && (
                    <div className="text-center text-sm text-gray-600">
                        Mengautentikasi melalui Google...
                        <div className="mt-2">
                            <button
                                onClick={handleGoogleLogin}
                                className="px-4 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-800 text-white transition"
                            >
                                Login dengan Google
                            </button>
                        </div>
                    </div>
                )}

                {/* Manual ID */}
                <div className="space-y-3">
                    <button
                        onClick={() => handleSelect(LoginOption.manualid)}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 w-full transition"
                    >
                        <User size={18} /> Gunakan ID Manual
                    </button>

                    {loginOption === LoginOption.manualid && (
                        <div className="space-y-2 transition-all duration-300 ease-in-out">
                            <input
                                type="text"
                                placeholder="Masukkan ID kamu, contoh: user-00123"
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                            />
                            <button
                                onClick={handleManualLogin}
                                className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-md text-sm transition"
                            >
                                Validasi & Masuk
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 text-center bg-gray-50 rounded-b-2xl">
                <p className="text-xs text-gray-500 leading-relaxed">
                    Dengan login, kamu menyetujui bahwa data identifikasi seperti Wallet ID, Manual ID, atau akun Google
                    digunakan untuk autentikasi dan personalisasi di dalam aplikasi.
                </p>
            </div>
        </div>
    );
}
