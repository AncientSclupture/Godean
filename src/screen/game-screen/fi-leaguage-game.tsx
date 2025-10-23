/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { AuthenticationContext } from "../../context/AuthContext";
import { MainLayout } from "../../components/main-layout";
import { LoaderComponent } from "../../components/LoaderComponent";
import ErrorHappened from "../../components/error-happened";
import RegistFiLeague from "../../components/fi-league/regist-fileague";
import FisimRealInvestmentGame from "../../game-sources/scene/fisim-real-investement-game";
import { useSelfCheck } from "../../hook/useSelfCheck";

export default function FinanceLeagueGameScreen() {
    const { isLoggedIn, accountid } = React.useContext(AuthenticationContext);
    const { isLoading, error, registered } = useSelfCheck();

    if (isLoading) return <LoaderComponent fullScreen={true} />;

    if (!isLoggedIn || !accountid) {
        return <ErrorHappened message="Kamu belum login atau akun tidak ditemukan." />
    }

    if (registered === false) {
        return <RegistFiLeague />
    }

    if (error) {
        return <ErrorHappened message={error} />
    }

    return (
        <MainLayout>
            <div className="h-screen w-full flex items-center justify-center">
                <FisimRealInvestmentGame />
            </div>
        </MainLayout>
    )
}