import { Instagram, Store, Twitter } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
    return (
        <div className="p-10 background-dark text-white space-y-5">
            <div className="flex flex-col md:flex-row items-start md:justify-around space-y-8 md:space-y-0">
                <div className="space-y-3">
                    <div className="flex items-center space-x-5">
                        <Store size={50} />
                        <p className="text-xl">Godean</p>
                    </div>
                    <p className="text-gray-400">Future gamefi.</p>
                </div>

                <div className="space-y-3">
                    <div>Godean Game Feature</div>
                    <div className="text-gray-400 hover:text-white cursor-pointer">
                        <Link to={"/play"}>Play</Link>
                    </div>
                    <div className="text-gray-400 hover:text-white cursor-pointer">
                        <Link to={"/fi-leaguage"}>Fi-League</Link>
                    </div>
                    <div className="text-gray-400 hover:text-white cursor-pointer">
                        <Link to={"/w2e"}>W2E</Link>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>Support</div>
                    <div className="text-gray-400 hover:text-white cursor-pointer">
                        <Link to={"/about"}>About Game</Link>
                    </div>
                    <div className="text-gray-400 hover:text-white cursor-pointer">
                        <Link to={"/contact"}>Contact</Link>
                    </div>
                    <div className="text-gray-400 hover:text-white cursor-pointer">
                        <Link to={"/faq"}>FAQ</Link>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>Social Media</div>
                    <div className="flex items-center space-x-3">
                        <Link to={'https://www.instagram.com/ancient.sclupture/'} target="_blank">
                            <Instagram />
                        </Link>
                        <Twitter />
                    </div>
                </div>

            </div>
            <div className="border-b border-gray-700 w-full" />
            <div className="w-full text-center">
                © 2025 AncientSclupture. All rights reserved.
            </div>
        </div>
    )
};