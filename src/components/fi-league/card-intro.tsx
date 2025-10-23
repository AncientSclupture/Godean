import React from "react"
import { ModalContext, ModalKindEnum } from "../../context/ModalContext"
import { GameTransitionDataContext } from "../../context/GameTransitionDataContext"

interface CardIntroFiLeagueProps {
    id: string | null;
    name: string;
    description: string;
    imageCover: string;
    reward: number;
    slash: string;
}

export function CardIntroFiLeague({ id, name, description, imageCover, reward, slash }: CardIntroFiLeagueProps) {
    const { setModalKind } = React.useContext(ModalContext);
    const { setRequiredId, gameCoverManagement } = React.useContext(GameTransitionDataContext);

    const handleStart = () => {
        setModalKind(ModalKindEnum.fileaguedetails);
        setRequiredId(id);
        gameCoverManagement.setter(name, description, imageCover, reward, slash)
    }

    return (
        <div className="w-[70vw] md:w-[26vw] bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full">
                <img
                    src={imageCover}
                    alt={name}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="p-4 flex flex-col justify-between h-48">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-3">{description}</p>
                </div>
                <button
                    onClick={handleStart}
                    className="mt-4 py-2 px-4 background-dark text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200"
                >
                    Mulai
                </button>
            </div>
        </div>
    )
}
