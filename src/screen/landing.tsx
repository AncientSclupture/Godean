import { DeveloperCard } from "../components/landing-components/developer-card";
import { MainLayout } from "../components/main-layout";

export default function Landing() {
    return (
        <MainLayout needProtection={false}>
            <div className="w-full h-full flex items-center justify-evenly">
                <DeveloperCard />
                <DeveloperCard />
                <DeveloperCard />
                <DeveloperCard />
            </div>
        </MainLayout>
    )
}