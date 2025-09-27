/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import CounterABI from "../abi/Counter.json";

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export type AuthenticationContextType = {
    accountid: string | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    contract: ethers.Contract | null;
    isLoggedIn: boolean;
};

export const AuthenticationContext = createContext<AuthenticationContextType>({
    accountid: null,
    isLoading: false,
    login: () => { },
    logout: () => { },
    contract: null,
    isLoggedIn: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [accountid, setAccountid] = useState<string | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = async () => {
        if ((window as any).ethereum) {
            try {
                setIsLoading(true);

                const provider = new ethers.BrowserProvider((window as any).ethereum);
                console.log("📡 Provider:", provider);

                const accounts = await provider.send("eth_requestAccounts", []);
                console.log("👤 Accounts:", accounts);
                setAccountid(accounts[0]);

                const network = await provider.getNetwork();
                console.log("🌐 Connected network:", network);

                // pastikan chainId = 31337 (Hardhat)
                if (network.chainId !== 31337n) {
                    alert(
                        `Wrong network! Please switch MetaMask to Hardhat Localhost (31337). Current: ${network.chainId}`
                    );
                    return;
                }

                const signer = await provider.getSigner();
                console.log("✍️ Signer:", signer);

                const counter = new ethers.Contract(CONTRACT_ADDRESS, CounterABI.abi, signer);
                console.log("📄 Counter contract instance:", counter);

                setContract(counter);
            } catch (err) {
                console.error("Login error:", err);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const logout = () => {
        setAccountid(null);
        setContract(null);
    };

    useEffect(() => {
        if (accountid) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [accountid])

    return (
        <AuthenticationContext.Provider
            value={{
                accountid,
                isLoading,
                login,
                logout,
                contract,
                isLoggedIn
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
};
