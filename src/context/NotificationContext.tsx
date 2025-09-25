/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export type NotificationType = {
    title: string | "default title";
    description: string | "no-description";
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-fit";
    duration?: number;
};

export type NotificationContextType = {
    notificationData: NotificationType;
    setNotificationData: (d: NotificationType) => void;
};

export const NotificationContext = createContext<NotificationContextType>({
    notificationData: { title: "default title", description: "no-description", position: "bottom-right", duration: 3000 },
    setNotificationData: () => { }
});

export const PopUpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notificationData, setNotificationData] = useState<NotificationType>({
        title: "default notif",
        description: "no-description",
        position: "bottom-right",
        duration: 3000
    });

    return (
        <NotificationContext.Provider value={{ notificationData, setNotificationData }}>
            {children}
        </NotificationContext.Provider>
    );
};
