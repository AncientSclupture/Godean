"use client";

import { MainLayout } from "../components/main-layout";
import { useState } from "react";
import {motion, AnimatePresence} from "framer-motion";
import {ChevronDown, ChevronUp} from "lucide-react";

const FAQS = [
    {
        question: "What is Nanduria?",
        answer:
        "Nanduria is a play-to-earn (P2E) and work-to-earn (W2E) finance simulation game inspired by Harvest Moon. You cultivate digital lands, trade crops, manage crypto-based assets, and grow your virtual economy in a blockchain-powered world.",
    },
    {
        question: "How do I earn in Nanduria?",
        answer:
        "Players earn by completing quests, farming virtual goods, and participating in decentralized markets. Your in-game productivity translates to real crypto rewards based on your performance and community engagement.",
    },
    {
        question: "Is Nanduria free to play?",
        answer:
        "Yes, Nanduria offers a free-to-play entry mode. Players can start with basic land plots and tools, and later expand their holdings or enhance productivity using NFT-based assets.",
    },
    {
        question: "What blockchain does Nanduria use?",
        answer:
        "Nanduria is built on a sustainable Layer-2 blockchain that supports fast transactions and low fees. This ensures smooth in-game trading and environmentally conscious gameplay.",
    },
    {
        question: "Can I trade or sell my in-game assets?",
        answer:
        "Absolutely. All major in-game items are represented as NFTs, allowing you to buy, sell, or trade them with other players in the Nanduria marketplace or on supported external NFT exchanges.",
    },
];

// [PANGGILAN RYAN JAWA: TOLONG KERJAIN DARI SINI YOW]
export default function FaQScreen() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
         <MainLayout needProtection={false}>
            <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50 to-emerald-100 py-16 px-6 flex flex-col items-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-extrabold text-emerald-700 mb-10 text-center"
                >
                    Frequently Asked Questions
                </motion.h1>

                <div className="w-full max-w-3xl space-y-4">
                {FAQS.map((faq, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white shadow-md rounded-2xl p-5 border border-emerald-100 hover:shadow-lg transition"
                    >
                    <button
                        onClick={() => toggleFAQ(index)}
                        className="flex justify-between items-center w-full text-left"
                    >
                        <span className="text-lg font-semibold text-gray-800">
                        {faq.question}
                        </span>
                        {activeIndex === index ? (
                        <ChevronUp className="text-emerald-500" />
                        ) : (
                        <ChevronDown className="text-emerald-500" />
                        )}
                    </button>

                    <AnimatePresence>
                        {activeIndex === index && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 text-gray-600 leading-relaxed"
                        >
                            {faq.answer}
                        </motion.div>
                        )}
                    </AnimatePresence>
                    </motion.div>
                ))}
                </div>
            </div>
        </MainLayout>
    )
}