import { DeveloperCard } from "../components/landing-components/developer-card";
import { MainLayout } from "../components/main-layout";

export default function Landing() {
    return (
        <MainLayout needProtection={false}>
            <div className="w-full h-full flex items-center justify-center my-10">
                <div className="w-fit space-y-5 md:flex md:items-center md:justify-evenly md:space-y-0 md:w-full">
                    <DeveloperCard Photo="/alex-profile.jpg" NamaDeveloper="Alex Cinatra" Role="Project Leader" Deskripsi="Membuat game, integrasi backend dan smartcontract" Linkedin="https://www.linkedin.com/in/alex-cinatra-520023256/"/>
                    <DeveloperCard Photo="/ryan-profile.jpg" NamaDeveloper="Ryan Krishandi Lukito" Role="Frontend Developer" Deskripsi="Membuat page frontend" Linkedin="https://www.linkedin.com/in/ryan-krishandi-lukito/"/>
                    <DeveloperCard Photo="/arden-profile.jpeg" NamaDeveloper="Cornelius Arden S.H." Role="Backend Developer" Deskripsi="Membuat backend dan mencari data realtime stock market" Linkedin="https://www.linkedin.com/in/ardenhermawan/"/>
                    <DeveloperCard Photo="/varick-profile.jpg" NamaDeveloper="Varick Zahir Sarjiman" Role="Smart Contract Developer" Deskripsi="Membuat smartcontract dan membuat bisnis logic" Linkedin="https://www.linkedin.com/in/varick-zahir-sarjiman/"/>
                </div>
            </div>
        </MainLayout>
    )
}