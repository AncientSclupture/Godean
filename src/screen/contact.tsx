import { MainLayout } from "../components/main-layout";

// [PANGGILAN RYAN JAWA: TOLONG KERJAIN DARI SINI YOW]
export default function ContactScreen() {
    return (
        <MainLayout needProtection={false}>
            <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-emerald-100 text-gray-800">
                {/* Hero Section */}
                <section className="w-full py-20 text-center bg-[url('/images/farm-contact.jpg')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 max-w-2xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    Contact the Nanduria Team
                    </h1>
                    <p className="text-gray-200 text-lg">
                    Have questions, feedback, or partnership ideas?  
                    We’d love to hear from you.
                    </p>
                </div>
                </section>

                {/* Contact Form Section */}
                <section className="flex-grow w-full py-16">
                <div className="max-w-4xl mx-auto px-6 bg-white shadow-md rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
                    Send us a message 🌾
                    </h2>

                    <form className="space-y-6">
                    <div>
                        <label className="block font-medium mb-2">Name</label>
                        <input
                        type="text"
                        placeholder="Your name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Email</label>
                        <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">Message</label>
                        <textarea
                        rows={5}
                        placeholder="Tell us what’s on your mind..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>
                    <div className="text-center">
                        <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg transition shadow-md"
                        >
                        Send Message
                        </button>
                    </div>
                    </form>
                </div>
                </section>

                {/* Social Links */}
                <section className="w-full bg-emerald-600 py-12 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Connect with Us</h2>
                <p className="mb-6 text-gray-100">
                    Join our growing decentralized community:
                </p>
                <div className="flex justify-center gap-6 text-3xl">
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-200 transition"
                        >
                        {/* <FaLinkedin /> */}
                    </a>
                    <a
                        href="https://discord.gg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-200 transition"
                        >
                        {/* <FaDiscord /> */}
                    </a>
                    <a
                        href="https://t.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-200 transition"
                        >
                        {/* <FaTelegramPlane /> */}
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-200 transition"
                        >
                        {/* <FaTwitter /> */}
                    </a>
                </div>
                <p className="mt-6 text-sm text-gray-200">
                    or email us directly at{" "}
                    <a
                        href="mailto:support@nanduria.io"
                        className="underline hover:text-emerald-300"
                        >
                        support@nanduria.io
                    </a>
                </p>
                </section>
            </div>
        </MainLayout>
    )
}