import { MainLayout } from "../components/main-layout";
import { Link } from "react-router";

// [PANGGILAN RYAN JAWA: TOLONG KERJAIN DARI SINI YOW]
export default function AboutGameScreen() {
    return (
        <MainLayout needProtection={false}>
            <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-emerald-50 to-emerald-100 text-gray-800">

                {/* Story Section */}
                <section className="max-w-5xl mx-auto px-6 py-16 text-center">
                <h2 className="text-3xl font-bold mb-6 text-emerald-700">
                    From Fields to Fortune
                </h2>
                <p className="text-lg leading-relaxed text-gray-700">
                    In the land of <strong>Nanduria</strong>, every seed you plant shapes not
                    only your farm — but the economy around you. Grow crops, trade goods,
                    and learn the fundamentals of financial growth through interactive
                    farming and trading systems inspired by the warmth of Harvest Moon.
                </p>
                </section>

                {/* Economy Section */}
                <section className="bg-white w-full py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-emerald-700 mb-10">
                    How the Economy Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-emerald-50 p-6 rounded-2xl shadow hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">💼 Work-to-Earn (W2E)</h3>
                        <p>
                        Complete daily jobs, deliveries, or community tasks to earn in-game
                        coins while improving your town’s economy.
                        </p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-2xl shadow hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">🪙 Play-to-Earn (P2E)</h3>
                        <p>
                        Trade, invest, and manage resources smartly to generate wealth. Every
                        decision impacts your growth and rewards.
                        </p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-2xl shadow hover:shadow-md transition">
                        <h3 className="text-xl font-semibold mb-2">🧠 Learn-to-Earn</h3>
                        <p>
                        Unlock educational quests and challenges that teach real-world
                        financial principles while rewarding gameplay.
                        </p>
                    </div>
                    </div>
                </div>
                </section>

                {/* Vision Section */}
                <section className="max-w-5xl mx-auto px-6 py-16 text-center">
                <h2 className="text-3xl font-bold mb-6 text-emerald-700">
                    Our Vision
                </h2>
                <p className="text-lg leading-relaxed text-gray-700">
                    We believe that games can teach financial literacy in a joyful and
                    meaningful way. <strong>Nanduria</strong> blends education, simulation,
                    and fun — turning every player into a confident financial grower.
                </p>
                </section>

                {/* CTA Section */}
                <section className="w-full bg-emerald-600 py-16 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Fortune?</h2>
                <p className="mb-6 text-lg">Start your journey in Nanduria today.</p>
                <Link to="/play" className="bg-white text-emerald-600 font-semibold px-8 py-3 rounded-lg hover:bg-emerald-100 transition">
                    Play Now
                </Link>
                </section>
            </div>
        </MainLayout>
    )
}