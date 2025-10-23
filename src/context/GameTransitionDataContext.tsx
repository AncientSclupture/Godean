/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export type GameTransitionDataContextType = {
    requiredId: string | null;
    setRequiredId: (d: string | null) => void;
    alias: string | null;
    setAliasPlayer: (d: string | null) => void;
    gameCoverManagement: {
        data: {
            name: string | null;
            description: string | null;
            imageplaceholder: string | null;
            reward: number | null;
            slash: string | null;
        };
        reseter: () => void;
        setter: (
            name: string | null,
            description: string | null,
            imageplaceholder: string | null,
            reward: number | null,
            slash: string | null
        ) => void;
    };
};

export const GameTransitionDataContext = createContext<GameTransitionDataContextType>({
    requiredId: null,
    alias: null,
    setRequiredId: () => { },
    setAliasPlayer: () => { },
    gameCoverManagement: {
        data: { name: null, description: null, imageplaceholder: null, reward: null, slash: null },
        reseter: () => { },
        setter: () => { },
    },
});

export const GameTransitionDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [requiredId, setRequiredId] = useState<string | null>(null);
    const [alias, setAlias] = useState<string | null>(null);
    const [gameCoverData, setGameCoverData] = useState<{
        name: string | null;
        description: string | null;
        imageplaceholder: string | null;
        reward: number | null;
        slash: string | null;
    }>({
        name: null,
        description: null,
        imageplaceholder: null,
        reward: null,
        slash: null
    });

    const changeRequiredId = (d: string | null) => {
        setRequiredId(d);
    };

    const changeAlias = (d: string | null) => {
        setAlias(d);
    };

    const setGameCover = (
        name: string | null,
        description: string | null,
        imageplaceholder: string | null,
        reward: number | null,
        slash: string | null
    ) => {
        setGameCoverData({ name, description, imageplaceholder, reward, slash });
    };

    const resetGameCover = () => {
        setGameCoverData({ name: null, description: null, imageplaceholder: null, reward: null, slash: null });
    };

    return (
        <GameTransitionDataContext.Provider
            value={{
                requiredId,
                alias,
                setRequiredId: changeRequiredId,
                setAliasPlayer: changeAlias,
                gameCoverManagement: {
                    data: gameCoverData,
                    reseter: resetGameCover,
                    setter: setGameCover,
                },
            }}
        >
            {children}
        </GameTransitionDataContext.Provider>
    );
};
