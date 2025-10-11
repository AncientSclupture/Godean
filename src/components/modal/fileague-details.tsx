import React, { useState } from "react"
import { ModalContext } from "../../context/ModalContext"
import { X } from "lucide-react"
import { useNavigate } from "react-router";

interface ModalFiLeagueDetailsProps {
  name?: string
  description?: string
  imageCover?: string
}

export default function ModalFiLeagueDetails({
  name,
  description,
  imageCover,
}: ModalFiLeagueDetailsProps) {
  const navigate = useNavigate();
  const { setModalKind } = React.useContext(ModalContext)
  const [agreed, setAgreed] = useState(false)

  function handleClose() {
    setModalKind(null);
  }

  function handleStart() {
    if (!agreed) return
    setModalKind(null);
    navigate("/play-fisim");
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-[90vw] md:w-[40vw] max-h-[85vh] relative animate-fadeIn flex flex-col">
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 transition bg-red-200 hover:bg-red-500 text-white rounded-full p-1"
      >
        <X />
      </button>

      <div className="overflow-y-auto p-6 space-y-4 no-scrollbar py-6">
        {/* Gambar */}
        <div className="w-full h-48 rounded-lg overflow-hidden">
          <img
            src={imageCover || "./finance-game-cover.jpeg"}
            alt={name || "Finance League Game"}
            className="object-cover w-full h-full"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {name || "Finance League Game"}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description ||
              "Game edukasi finansial untuk melatih kemampuan analisis dan pengambilan keputusan investasi yang cerdas."}
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">🎯 Aturan Permainan</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Baca setiap kasus dan ambil tindakan yang paling logis.</li>
            <li>Setiap tindakan akan berpengaruh skor kamu.</li>
            <li>Jika skor melebihi ambang tertentu, kamu akan mendapatkan hadiah.</li>
            <li>Game ini bersifat edukatif, tidak ada kehilangan uang asli.</li>
          </ul>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-indigo-700">🎁 Reward</h4>
            <p className="text-sm text-indigo-600">100 Token + Sertifikat Terlegasi</p>
          </div>
          <div className="text-3xl">🏅</div>
        </div>

        <div className="flex items-center">
          <input
            id="agreeRules"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mr-2 accent-indigo-600"
          />
          <label htmlFor="agreeRules" className="text-sm text-gray-700">
            Saya telah membaca dan menyetujui aturan permainan
          </label>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex justify-end space-x-2 bg-white rounded-b-2xl">
        <button
          onClick={handleClose}
          className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Tutup
        </button>
        <button
          onClick={handleStart}
          disabled={!agreed}
          className={`py-2 px-4 rounded-lg text-white font-semibold transition 
            ${agreed
              ? "background-dark hover:opacity-90"
              : "bg-gray-400 cursor-not-allowed"}`}
        >
          Mulai Game
        </button>
      </div>
    </div>
  )
}
