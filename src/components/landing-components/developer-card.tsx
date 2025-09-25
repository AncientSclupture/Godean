import { Link } from "react-router";

export function DeveloperCard() {
    return (
        <div className="w-64 h-80 [perspective:1000px]">
            <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group hover:[transform:rotateY(180deg)]">

                {/* Front side (gambar) */}
                <div className="absolute inset-0">
                    <div
                        className="w-full h-full object-cover rounded-xl shadow-lg background-dark"
                    />
                </div>

                {/* Back side (info) */}
                <div className="absolute inset-0 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <h2 className="text-xl font-bold">Nama Developer</h2>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="mt-2 text-gray-700">
                        Ini adalah deskripsi singkat tentang developer.
                    </p>
                    <Link
                        to="https://linkedin.com"
                        className="mt-4 text-blue-500 hover:underline"
                    >
                        LinkedIn
                    </Link>
                </div>
            </div>
        </div>
    );
}
