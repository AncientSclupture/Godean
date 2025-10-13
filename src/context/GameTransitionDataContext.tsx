/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export type GameTransitionDataContextType = {
    requiredId: string | null,
    setRequiredId: (d: string | null) => void,
    alias: string | null,
    setAliasPlayer: (d: string | null) => void,
}

export const GameTransitionDataContext = createContext<GameTransitionDataContextType>({
    requiredId: null,
    alias: null,
    setRequiredId: () => { },
    setAliasPlayer: () => { },
})

export const GameTransitionDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [requiredId, setrequiredId] = useState<string | null>(null)
    const [alias, setAlias] = useState<string | null>(null)

    const changeRequiredId = (d: string | null) => {
        setrequiredId(d);
    }

    const changeAlias = (d: string | null) => {
        setAlias(d);
    }
    return (
        <GameTransitionDataContext.Provider value={{
            requiredId: requiredId,
            alias: alias,
            setRequiredId: changeRequiredId,
            setAliasPlayer: changeAlias,
        }}>
            {children}
        </GameTransitionDataContext.Provider>
    );
}