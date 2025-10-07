import React from "react";
import { Notification } from "./Notification";
import { Navigation } from "./navigation";
import { Footer } from "./footer";
import ModalWrapper from "./modal/modal-wrapper";
import { ModalKindEnum } from "../context/ModalContext";
import ModalLoginOption from "./modal/login-option";
import { AuthenticationContext } from "../context/AuthContext";
import Forbidden from "./forbiden";

export function MainLayout({ needProtection = true, children }: { needProtection?: boolean, children: React.ReactNode }) {
    const { isLoggedIn } = React.useContext(AuthenticationContext);

    if (needProtection && !isLoggedIn) return <Forbidden />

    return (
        <div className="w-full overflow-hidden min-h-screen">
            <Navigation />
            <div className="h-screen w-full flex items-center justify-center">
                {children}
            </div>
            <Footer />

            <ModalWrapper
                listcontent={[
                    { name: ModalKindEnum.loginopt, component: <ModalLoginOption /> },
                ]}
            />

            <Notification />
        </div>
    )
};