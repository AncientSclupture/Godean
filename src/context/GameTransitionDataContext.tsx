/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export type GameTransitionDataContextType = {
    requiredId: string | null,
    setRequiredId: (d: string | null) => void,
}

export const GameTransitionDataContext = createContext<GameTransitionDataContextType>({
    requiredId: null,
    setRequiredId: () => { }
})

export const GameTransitionDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [requiredId, setrequiredId] = useState<string | null>(null)
    const changeRequiredId = (d: string | null) => {
        setrequiredId(d);
    }
    return (
        <GameTransitionDataContext.Provider value={{
            requiredId: requiredId,
            setRequiredId: changeRequiredId
        }}>
            {children}
        </GameTransitionDataContext.Provider>
    );
}