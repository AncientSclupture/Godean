import { Link } from "react-router";

export function Navigation() {
    return (
        <div className="px-8 py-5 flex items-center justify-between background-dark text-white">
            <div className="text-xl">Godean</div>
            <div className="flex items-center space-x-8">
                <div
                    className="cursor-pointer hover:text-gray-200"
                >
                    <Link to={"/play"}>Play</Link>
                </div>
                <div
                    className="cursor-pointer hover:text-gray-200"
                >
                    <Link to={"/fi-leaguage"}>Fi-League</Link>
                </div>
                <div
                    className="cursor-pointer hover:text-gray-200"
                >
                    <Link to={"/w2e"}>W2E</Link>
                </div>
                <div
                    className="bg-gray-700 p-2 md:px-3 rounded-md hover:bg-gray-400 cursor-pointer text-white"
                >
                    Connect
                </div>
            </div>
        </div>
    )
}