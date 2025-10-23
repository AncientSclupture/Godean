import React from "react";
import { Notification } from "./Notification";
import { Navigation } from "./navigation";
import { Footer } from "./footer";
import ModalWrapper from "./modal/modal-wrapper";
import { ModalKindEnum } from "../context/ModalContext";
import ModalLoginOption from "./modal/login-option";
import { AuthenticationContext } from "../context/AuthContext";
import Forbidden from "./forbiden";
import ModalGameDetails from "./modal/game-details";
import ModalFiLeagueDetails from "./modal/fileague-details";
import ModalApplyW2E from "./modal/apply-w2e";

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
                    { name: ModalKindEnum.gamedetails, component: <ModalGameDetails /> },
                    { name: ModalKindEnum.fileaguedetails, component: <ModalFiLeagueDetails /> },
                    { name: ModalKindEnum.applyw2e, component: <ModalApplyW2E /> },
                ]}
            />

            <Notification />
        </div>
    )
};