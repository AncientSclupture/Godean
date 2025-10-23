import React from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthenticationContext } from '../../context/AuthContext';
import { MainLayout } from '../../components/main-layout';
import ErrorHappened from '../../components/error-happened';
import RegistFiLeague from '../../components/main-activity/regist-fileague';
import { LoaderComponent } from '../../components/LoaderComponent';
import PeacefullVillageDreamGame from '../../game-sources/scene/peacefull-dream-village-game';

export default function PeacefullVillageGameScreen() {
    const { isLoggedIn, accountid } = React.useContext(AuthenticationContext);
    const [isSelfCheckLoading, setIsLoadingCheck] = React.useState(true);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [error, setError] = React.useState<string | null>(null);
    const [registered, setRegistered] = React.useState<boolean | null>(null);
    const [alias, setAlias] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function fetchData() {
            setIsLoadingCheck(true)
            try {
                const response = await fetch("https://godean-backend-api.vercel.app/api/fi-sim/self-check", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ accId: accountid })
                })

                const data = await response.json();

                if (response.status === 200) {
                    setAlias(data.data.name);
                    console.log(data.data.name);
                    setRegistered(true);
                } else if (response.status === 404) {
                    setRegistered(false);
                }
                else {
                    const message = data?.msg || `HTTP error! Status: ${response.status}`;
                    throw new Error(`HTTP error! Status: ${message}`)
                }

                setError(null)
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

                setNotificationData({ title: "error", description: `Error while sync player data with games: ${errorMessage}`, position: "bottom-right" })
                setError(errorMessage)
            } finally {
                setIsLoadingCheck(false);
            }
        }

        fetchData()
    }, [setNotificationData, accountid])

    if (isSelfCheckLoading) return <LoaderComponent fullScreen={true} />

    if (!isLoggedIn || !accountid || !alias) {
        return (
            <MainLayout>
                <ErrorHappened message="User not logged in or account ID missing." />
            </MainLayout>
        )
    };

    if (error) {
        return (
            <MainLayout>
                <ErrorHappened message={error} />
            </MainLayout>
        )
    };

    if (registered === false) return <RegistFiLeague />
    return (
        <MainLayout>
            <div className="h-screen w-full flex items-center justify-center">
                <PeacefullVillageDreamGame />
            </div>
        </MainLayout>
    );
}

