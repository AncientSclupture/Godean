import { CardIntroFiLeague } from "../components/fi-league/card-intro"
import { MainLayout } from "../components/main-layout"

const FinanceLeagueData: {
    id: string | null;
    name: string;
    description: string;
    imageCover: string;
    reward: number;
}[] = [
        {
            id: "test-123",
            name: "Who Is Fraud and Why?",
            description: "Uji kemampuanmu dalam mengenali perusahaan palsu! Pelajari tanda-tanda penipuan berkedok investasi, MLM, dan ponzi melalui simulasi interaktif dan studi kasus nyata.",
            imageCover: "./finance-game-cover.jpeg",
            reward: 10
        },
        {
            id: "test-123",
            name: "Do i know how to invest properly?",
            description: "Tantang dirimu dalam membuat keputusan investasi yang bijak. Pelajari prinsip dasar investasi sehat, manajemen risiko, dan cara membedakan peluang dari jebakan finansial.",
            imageCover: "./finance-game-cover.jpeg",
            reward: 20
        },
        {
            id: "test-123",
            name: "Real Investment Simulation",
            description: "Masuki dunia simulasi investasi nyata! Bangun portofolio, analisis pasar, dan lihat bagaimana strategi keuanganmu bertahan dalam kondisi ekonomi yang dinamis.",
            imageCover: "./finance-game-cover.jpeg",
            reward: 30
        }
    ]

export default function FinanceLeagueScreen() {
    return (
        <MainLayout>
            <div className="min-h-screen w-full flex">
                <div className="w-full p-8 space-y-5">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-semibold text-center">Finance League</h1>
                        <div className="flex flex-col items-center justify-center text-sm font-semibold text-gray-500">
                            <p>Find, Learn and Earn your Certification Through</p>
                            <p>Real World Finance Problem Solving</p>
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
                            <CardIntroFiLeague
                                key={idx}
                                id={d.id}
                                name={d.name}
                                description={d.description}
                                imageCover={d.imageCover}
                                reward={d.reward}
                            />
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}