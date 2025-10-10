import { DeveloperCard } from "../components/landing-components/developer-card";
import { MainLayout } from "../components/main-layout";

export default function Landing() {
    return (
        <MainLayout needProtection={false}>
            <div className="w-full h-full flex items-center justify-center my-10">
                <div className="w-fit space-y-5 md:flex md:items-center md:justify-evenly md:space-y-0 md:w-full">
                    <DeveloperCard />
                    <DeveloperCard />
                    <DeveloperCard />
                    <DeveloperCard />
                </div>
            </div>
        </MainLayout>
    )
}