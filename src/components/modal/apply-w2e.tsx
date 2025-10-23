import { Calendar, Coins, ListChecks, Users, X } from "lucide-react";
import { ModalContext } from "../../context/ModalContext";
import React from "react";
import { GameTransitionDataContext } from "../../context/GameTransitionDataContext";

export default function ModalApplyW2E() {
    const { setModalKind } = React.useContext(ModalContext);
    const { w2eApplyManagement } = React.useContext(GameTransitionDataContext);

    const handleDownload = (filename: string | null) => {
        let fileUrl = '/contracts/task-001_contract.pdf';
        if (filename) {
            fileUrl = filename;
        }
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'task-001_contract.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function handleClose() {
        setModalKind(null);
    }

    function handleSubmit(filename: string | null) {
        handleDownload(filename)
        handleClose();
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-300 overflow-hidden animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Kontrak / Bargain Proposal
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-md hover:bg-gray-100 transition"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5 text-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{w2eApplyManagement.data.biddersCount} bidder sedang apply untuk project ini</span>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                            <ListChecks className="h-4 w-4" /> Daftar Jobdesk
                        </label>
                        <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                            {(w2eApplyManagement.data.tasks ?? []).length > 0 ? (
                                (w2eApplyManagement.data.tasks ?? []).map((task, idx) => (
                                    <li key={idx} className="leading-snug">
                                        {task}
                                    </li>
                                ))
                            ) : (
                                <li className="italic text-gray-400">
                                    Tidak ada jobdesk terdaftar.
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Tenggat pengerjaan:{" "}
                            <span className="font-medium text-gray-800">{w2eApplyManagement.data.deadline}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Coins className="h-4 w-4" />
                        <span>
                            Token Reward:{" "}
                            <span className="font-medium text-gray-800">{w2eApplyManagement.data.reward}</span>
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => handleSubmit(w2eApplyManagement.data.contract)}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition"
                    >
                        Unduh Kontrak
                    </button>
                </div>
            </div>
        </div>
    );
}
