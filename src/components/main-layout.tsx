import type React from "react";
import { Notification } from "./Notification";
import { Navigation } from "./navigation";
import { Footer } from "./footer";
import ModalWrapper from "./modal/modal-wrapper";
import { ModalKindEnum } from "../context/ModalContext";
import ModalLoginOption from "./modal/login-option";

export function MainLayout({ index = false, children }: { index?: boolean, children: React.ReactNode }) {
    console.log(index)
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