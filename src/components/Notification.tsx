import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../context/NotificationContext";

export function Notification() {
    const context = useContext(NotificationContext);
    const { notificationData, setNotificationData } = context;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (notificationData.title !== "default notif") {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setNotificationData({
                    title: "default notif",
                    description: "no-description",
                    position: "bottom-right",
                    duration: 3000
                });
            }, notificationData.duration ?? 3000);
            return () => clearTimeout(timer);
        }
    }, [notificationData, setNotificationData]);

    if (!visible) return null;

    const positionClasses: Record<string, string> = {
        "top-left": "absolute top-4 left-4",
        "top-right": "absolute top-4 right-4",
        "bottom-left": "absolute bottom-4 left-4",
        "bottom-right": "absolute bottom-4 right-4",
        "center-fit":
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    };

    if (notificationData.position !== 'center-fit') return (
        <div className="fixed inset-0 z-[50]">
            {/* backdrop */}
            <div className={`absolute inset-0 ${'bg-none'} z-[50]`} onClick={() => setVisible(false)} />

            {/* notif card */}
            <div
                className={`z-[60] p-4 rounded-xl shadow-lg bg-white border border-gray-300 space-y-2
                transition-all duration-300 w-[80vw] md:w-[32vw] ${positionClasses[notificationData.position]}`}
            >
                <h3 className="font-semibold text-gray-800">
                    {notificationData.title}
                </h3>
                <p className="text-gray-600">
                    {notificationData.description}
                </p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[50]">
            {/* backdrop */}
            <div className={`absolute inset-0 ${notificationData.position === "center-fit" ? 'bg-black/40 backdrop-blur-sm ' : 'bg-none'} z-[50]`} onClick={() => setVisible(false)} />

            {/* notif card */}
            <div
                className={`z-[60] p-8 rounded-xl shadow-lg bg-white border border-gray-300 space-y-5
                transition-all duration-300 w-[80vw] md:w-[40vw] md:min-h-[12vw] ${positionClasses[notificationData.position]}`}
            >
                <h3 className="font-semibold text-gray-800 text-2xl">
                    {notificationData.title}
                </h3>
                <p className="md:text-xl text-gray-600">
                    {notificationData.description}
                </p>
            </div>
        </div>
    );
}
