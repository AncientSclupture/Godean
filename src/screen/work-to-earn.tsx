import { MainLayout } from "../components/main-layout"
import CardJob from "../components/w2e/card-job";

const WorkToEarnData: {
    id: string | null;
    title: string;
    briefdescription: string;
    contract: string;
    details: {
        tokenprice: number;
        deadline: number;
        info?: string[] | null;
    }
}[] = [
        {
            id: 'task-001',
            title: 'Translate short article to Indonesian',
            briefdescription: 'Translate a 300-word English article into fluent Indonesian.',
            contract: "./task-001_contract.pdf",
            details: {
                tokenprice: 800,
                deadline: new Date('2025-10-20T23:59:59').getTime(),
                info: ['Language: English → Indonesian', 'Word count: ~300 words']
            }
        },
        {
            id: 'task-002',
            title: 'Label 100 product images',
            briefdescription: 'Tag product categories (e.g., shoes, bags, electronics) for 100 images.',
            contract: "./task-002_contract.pdf",
            details: {
                tokenprice: 1500,
                deadline: new Date('2025-10-22T18:00:00').getTime(),
                info: ['Images provided via link', 'Use our tagging web tool']
            }
        },
        {
            id: 'task-003',
            title: 'Write a 200-word product review',
            briefdescription: 'Write an honest review of a smart home device based on given specifications.',
            contract: "./task-003_contract.pdf",
            details: {
                tokenprice: 1000,
                deadline: new Date('2025-10-25T12:00:00').getTime(),
                info: ['Tone: Neutral and informative', 'Include 1 image']
            }
        },
        {
            id: 'task-004',
            title: 'Transcribe short audio clip',
            briefdescription: 'Transcribe a 2-minute English audio recording accurately.',
            contract: "./task-004_contract.pdf",
            details: {
                tokenprice: 600,
                deadline: new Date('2025-10-19T15:00:00').getTime(),
                info: ['Audio length: 2 min', 'Format: .wav', 'Accuracy ≥ 95%']
            }
        },
        {
            id: 'task-005',
            title: 'Collect feedback on mobile app UI',
            briefdescription: 'Test a new mobile app and provide usability feedback.',
            contract: "./task-005_contract.pdf",
            details: {
                tokenprice: 2000,
                deadline: new Date('2025-10-28T09:00:00').getTime(),
                info: ['Platform: Android only', 'Submit feedback form']
            }
        },
        {
            id: 'task-006',
            title: 'Summarize a YouTube video',
            briefdescription: 'Watch a 5-minute educational video and create a short summary.',
            contract: "./task-006_contract.pdf",
            details: {
                tokenprice: 900,
                deadline: new Date('2025-10-23T22:00:00').getTime(),
                info: ['Video topic: Climate change', 'Summary length: 100-150 words']
            }
        }
    ];

export default function W2EScreen() {
    return (
        <MainLayout>
            <div className="min-h-screen w-full flex">
                <div className="w-full p-8 space-y-5">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-semibold text-center">Work To Earn</h1>
                        <div className="flex flex-col items-center justify-center text-sm font-semibold text-gray-500">
                            <p>Be confident, chat the hustler and bargain about the published job</p>
                            <p>Finished the job, then gain your token and portofolio</p>
                        </div>
                    </div>
                    <div className="w-full flex items-end justify-end">
                        <div className="p-5 space-x-2 flex items-center">
                            <input
                                type="text" name="search" id="search"
                                className="p-2 border border-gray-300 rounded-md w-[60vw] md:w-[20vw]"
                                placeholder="serach ..."
                            />
                            <button
                                className="p-2 background-dark text-white rounded-lg cursor-pointer"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center gap-4">
                        {WorkToEarnData.map((item) => (
                            <CardJob key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}