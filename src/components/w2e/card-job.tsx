import React from "react";
import { CalendarDays, ChevronDown, ChevronUp, Coins, Info } from "lucide-react";
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";
import { GameTransitionDataContext } from "../../context/GameTransitionDataContext";

interface WorkToEarnItem {
    id: string | null;
    title: string;
    briefdescription: string;
    contract: string;
    details: {
        tokenprice: number;
        deadline: number;
        info?: string[] | null;
    };
}

export default function CardJob({ item }: { item: WorkToEarnItem }) {
    const [isOpen, setIsOpen] = React.useState(false);

    const { setModalKind } = React.useContext(ModalContext);
    const { w2eApplyManagement } = React.useContext(GameTransitionDataContext);

    const toggleAccordion = () => setIsOpen((prev) => !prev);

    const deadlineDate = new Date(item.details.deadline).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="w-full border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white">
            {/* Header */}
            <button
                onClick={toggleAccordion}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                    <p className="text-sm text-gray-500">{item.briefdescription}</p>
                </div>
                <div className="text-gray-500">
                    {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </div>
            </button>

            {/* Accordion Body */}
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"
                    }`}
            >
                <div className="p-5 space-y-3">
                    <div className="flex items-center space-x-2 text-gray-700">
                        <Coins size={18} className="text-emerald-600" />
                        <span className="font-semibold">
                            {item.details.tokenprice.toLocaleString()} tokens
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                        <CalendarDays size={18} className="text-blue-600" />
                        <span className="text-sm">{deadlineDate}</span>
                    </div>

                    {item.details.info && item.details.info.length > 0 && (
                        <div className="pt-2">
                            <div className="flex items-center space-x-2 text-gray-700 mb-2">
                                <Info size={18} className="text-gray-500" />
                                <span className="text-sm font-medium">Details:</span>
                            </div>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {item.details.info.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="pt-3 flex justify-end">
                        <button
                            onClick={() => { 
                                w2eApplyManagement.setter(
                                    Math.floor(Math.random() * 100),
                                    deadlineDate,
                                    item.contract,
                                    item.details.tokenprice,
                                    item.details.info ?? null,
                                )
                                setModalKind(ModalKindEnum.applyw2e)
                            }}
                            className="background-dark text-white py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}