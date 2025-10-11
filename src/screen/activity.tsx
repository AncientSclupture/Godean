import React from "react";
import { MainLayout } from "../components/main-layout";
import Game from "../game-sources/Game";
import { AuthenticationContext } from "../context/AuthContext";
import ErrorHappened from "../components/error-happened";

export default function ActifityScreen() {
    const { isLoggedIn, accountid } = React.useContext(AuthenticationContext);

    if (!isLoggedIn || !accountid) {
        return (
            <MainLayout>
                <ErrorHappened message="User not logged in or account ID missing." />
            </MainLayout>
        )
    };

    return (
        <MainLayout>
            <div className="h-screen w-full flex items-center justify-center">
                <Game accountId={accountid} />
            </div>
        </MainLayout>
    )
}