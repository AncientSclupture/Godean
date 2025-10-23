import React from "react";
import { MainLayout } from "../components/main-layout";
import { AuthenticationContext } from "../context/AuthContext";
import ErrorHappened from "../components/error-happened";
import { CardIntroMainActifity } from "../components/main-activity/card-intro";

const FinanceLeagueData: {
    id: string | null;
    name: string;
    description: string;
    imageCover: string;
}[] = [
        {
            id: "test-123",
            name: "Peacefull Village Dream",
            description: "Desa yang damai tetapi sibuk, kamu harus bertahan untuk bisa ada disini. Jika kamu harus menjadi pekerja keras dan cerdas. Farming, Bargain dan berinteraksi dengan player lain ",
            imageCover: "./finance-game-cover.jpeg"
        },
        {
            id: "test-123",
            name: "Survival and Adventure",
            description: "Masuk kedalam hutan cari dan ambil resource yang kamu temui. Hati hati ada banyak monster yang akan mengahdang kamu!",
            imageCover: "./finance-game-cover.jpeg"
        },
        {
            id: "test-123",
            name: "Hide and Seek",
            description: "Tangkap dan kejar hewan sebanyak mungkin, dapatkan hadiah secara acak. Uji keberuntungan kamu disini!",
            imageCover: "./finance-game-cover.jpeg"
        }
    ]


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
            <div className="min-h-screen w-full flex">
                <div className="w-full p-8 space-y-5">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-semibold text-center">Godean Games</h1>
                        <div className="flex flex-col items-center justify-center text-sm font-semibold text-gray-500">
                            <p>Explore joyfull and kindness here</p>
                        </div>
                    </div>
                    <div className="w-full flex items-end justify-end">
                        <div className="p-5 space-x-2 flex items-center">
                            <input
                                type="text" name="search" id="search"
                                className="p-2 border border-gray-300 rounded-md w-[60vw] md:w-[20vw]"
                                placeholder="name ..."
                            />
                            <button
                                className="p-2 background-dark text-white rounded-lg cursor-pointer"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="p-5 space-y-5 md:space-y-0 flex md:flex-row flex-wrap justify-around">
                        {FinanceLeagueData.map((d, idx) =>
                            <CardIntroMainActifity
                                key={idx}
                                id={d.id}
                                name={d.name}
                                description={d.description}
                                imageCover={d.imageCover}
                            />
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}