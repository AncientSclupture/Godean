import { DeveloperCard } from "../components/landing-components/developer-card";
import { MainLayout } from "../components/main-layout";

export default function Landing() {
    return (
        <MainLayout needProtection={false}>
            <div className="w-full h-full flex items-center justify-center my-10">
                <div className="w-fit space-y-5 md:flex md:items-center md:justify-evenly md:space-y-0 md:w-full">
                    <DeveloperCard Photo="/alex.jpeg" NamaDeveloper="Alex Cinatra" Role="Beban Tim" Deskripsi="Deskripsi" Linkedin="https://www.linkedin.com/in/alex-cinatra-520023256/"/>
                    <DeveloperCard Photo="/ryan.jpg" NamaDeveloper="Ryan Krishandi Lukito" Role="Frontend Developer" Deskripsi="Deskripsi" Linkedin="https://www.linkedin.com/in/ryan-krishandi-lukito/"/>
                    <DeveloperCard Photo="/arden.jpg" NamaDeveloper="Cornelius Arden S.H." Role="Backend Developer" Deskripsi="Deskripsi" Linkedin="https://www.linkedin.com/in/ardenhermawan/"/>
                    <DeveloperCard Photo="/varick.jpg" NamaDeveloper="Varick Zahir Sarjiman" Role="Smart Contract Developer" Deskripsi="Deskripsi" Linkedin="https://www.linkedin.com/in/varick-zahir-sarjiman/"/>
                </div>
            </div>
        </MainLayout>
    )
}