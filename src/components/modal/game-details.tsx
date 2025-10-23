import React from "react"
import { ModalContext } from "../../context/ModalContext"
import { X } from "lucide-react"
import { useNavigate } from "react-router";
import { GameTransitionDataContext } from "../../context/GameTransitionDataContext";

export default function ModalGameDetails() {
  const navigate = useNavigate();
  const { setModalKind } = React.useContext(ModalContext)
  const { gameCoverManagement } = React.useContext(GameTransitionDataContext);

  function handleClose() {
    setModalKind(null);
  }

  function handleStart() {
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
            src={gameCoverManagement.data.imageplaceholder || "./finance-game-cover.jpeg"}
            alt={gameCoverManagement.data.name || "Finance League Game"}
            className="object-cover w-full h-full"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {gameCoverManagement.data.name || "Finance League Game"}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {gameCoverManagement.data.description ||
              "Game edukasi finansial untuk melatih kemampuan analisis dan pengambilan keputusan investasi yang cerdas."}
          </p>
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
          className={`py-2 px-4 rounded-lg text-white font-semibold transition background-dark hover:opacity-90`}
        >
          Mulai Game
        </button>
      </div>
    </div>
  )
}
