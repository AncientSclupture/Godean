import React from "react";
import { MainLayout } from "../components/main-layout";
import Game from "../game-sources/Game";
import { AuthenticationContext } from "../context/AuthContext";

export default function ActifityScreen() {
    const { isLoggedIn, accountid } = React.useContext(AuthenticationContext);

    if (!isLoggedIn || !accountid) {
        return (
            <MainLayout>
                <div>user is not loggged in</div>
            </MainLayout>
        )
    };

    console.log(accountid)

    return (
        <MainLayout>
            <div className="h-screen w-full flex items-center justify-center">
                <Game accountId={accountid} />
            </div>
        </MainLayout>
    )
}