import { Link } from "react-router";

export function DeveloperCard({NamaDeveloper, Role, Deskripsi, Linkedin, Photo}: {NamaDeveloper: string, Role: string, Deskripsi: string, Linkedin: string, Photo: string}) {
    return (
        <div className="w-64 h-80 [perspective:1000px]">
            <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group hover:[transform:rotateY(180deg)]">

                {/* Front side (gambar) */}
                <div className="absolute inset-0">
                    <img 
                        src={Photo}
                        alt="" 
                        className="w-full h-full object-cover rounded-xl shadow-lg background-dark"/>
                    {/* <div
                        className="w-full h-full object-cover rounded-xl shadow-lg background-dark"
                    /> */}
                </div>

                {/* Back side (info) */}
                <div className="absolute inset-0 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <h2 className="text-xl font-bold">{NamaDeveloper}</h2>
                    <p className="text-sm text-gray-600">{Role}</p>
                    <p className="mt-2 text-gray-700">
                        {Deskripsi}
                    </p>
                    <Link
                        to={Linkedin}
                        className="mt-4 text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}
