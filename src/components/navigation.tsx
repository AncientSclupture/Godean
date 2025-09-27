import React from "react";
import { useNavigate } from "react-router";
import { AuthenticationContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";

export function Navigation() {
    const navigate = useNavigate();
    const { isLoggedIn, login } = React.useContext(AuthenticationContext);
    const { setNotificationData } = React.useContext(NotificationContext)

    function handleNavigate(to: string, needAuth: boolean = true) {
        if (isLoggedIn || !needAuth) {
            navigate(to);
        } else {
            setNotificationData({
                title: 'connect first',
                description: 'connect with the connect button',
                position: "bottom-right"
            });
        }
    }

    return (
        <div className="px-8 py-5 flex items-center justify-between background-dark text-white">
            <div
                onClick={() => handleNavigate("/", false)}
                className="text-xl cursor-pointer"
            >
                Godean
            </div>
            <div className="flex items-center space-x-8">
                <div
                    onClick={() => handleNavigate("/play")}
                    className="cursor-pointer hover:text-gray-200"
                >
                    Play
                </div>
                <div
                    onClick={() => handleNavigate("/fi-leaguage")}
                    className="cursor-pointer hover:text-gray-200"
                >
                    Fi-League
                </div>
                <div
                    onClick={() => handleNavigate("/w2e")}
                    className="cursor-pointer hover:text-gray-200"
                >
                    W2E
                </div>
                <div
                    onClick={() => login()}
                    className="bg-gray-700 p-2 md:px-3 rounded-md hover:bg-gray-400 cursor-pointer text-white"
                >
                    {isLoggedIn ? 'connected' : 'Connect'}
                </div>
            </div>
        </div>
    )
}