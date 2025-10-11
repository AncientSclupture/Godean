import React from "react";
import { Notification } from "./Notification";
import { Navigation } from "./navigation";
import { Footer } from "./footer";
import ModalWrapper from "./modal/modal-wrapper";
import { ModalKindEnum } from "../context/ModalContext";
import ModalLoginOption from "./modal/login-option";
import { AuthenticationContext } from "../context/AuthContext";
import Forbidden from "./forbiden";
import ModalFiLeagueDetails from "./modal/fileague-details";

export function MainLayout({ needProtection = true, children }: { needProtection?: boolean, children: React.ReactNode }) {
    const { isLoggedIn } = React.useContext(AuthenticationContext);

    if (needProtection && !isLoggedIn) return <Forbidden />

    return (
        <div className="flex flex-col w-full min-h-screen">
            <Navigation />
            <div className="flex-grow">
                {children}
            </div>
            <Footer />

            <ModalWrapper
                listcontent={[
                    { name: ModalKindEnum.loginopt, component: <ModalLoginOption /> },
                    { name: ModalKindEnum.fileaguedetails, component: <ModalFiLeagueDetails /> },
                ]}
            />

            <Notification />
        </div>
    )
};