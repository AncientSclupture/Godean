import React from "react"
import { ModalContext } from "../../context/ModalContext"
import { X } from "lucide-react";

export default function ModalLoginOption() {
    const { setModalKind } = React.useContext(ModalContext);

    function handleclose() {
        setModalKind(null);
    }

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Login With</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => handleclose()}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};