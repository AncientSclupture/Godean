/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export enum ModalKindEnum {
    loginopt = "loginopt",
}

export type ModalContextType = {
    modalKind: ModalKindEnum | null,
    setModalKind: (d: ModalKindEnum | null) => void;
    modalLoadingProgress: boolean | null,
    setModalLoadingProgress: (d: boolean | null) => void;
    modalProgressIsDone: boolean | null,
    setModalProgressIsDone: (d: boolean | null) => void;
}

export const ModalContext = createContext<ModalContextType>({
    modalKind: null,
    modalLoadingProgress: null,
    modalProgressIsDone: null,
    setModalKind: () => { },
    setModalLoadingProgress: () => { },
    setModalProgressIsDone: () => { }
})

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalKind, setModalKind] = useState<ModalKindEnum | null>(null);
    const [isLoading, setIsLoading] = useState<boolean | null>(null);
    const [isDone, setIsDone] = useState<boolean | null>(null);

    function setModalShowUp(d: ModalKindEnum | null) {
        setModalKind(d);
    }

    function changeLoadingStatus(d: boolean | null) {
        setIsLoading(d);
    }

    function changeProgressStatus(d: boolean | null) {
        setIsDone(d);
    }

    return(
        <ModalContext.Provider value={{
            modalKind: modalKind,
            modalLoadingProgress: isLoading,
            modalProgressIsDone: isDone,
            setModalKind: setModalShowUp,
            setModalLoadingProgress: changeLoadingStatus,
            setModalProgressIsDone: changeProgressStatus
        }}>
            {children}
        </ModalContext.Provider>
    );
}

