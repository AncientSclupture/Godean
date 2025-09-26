// src/App.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CounterABI from "../abi/Counter.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function TestSM() {
    const [account, setAccount] = useState<string>();
    const [count, setCount] = useState<number>(0);
    const [contract, setContract] = useState<ethers.Contract>();

    // connect wallet
    const connectWallet = async () => {
        if ((window as any).ethereum) {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setAccount(accounts[0]);

            const signer = await provider.getSigner();
            const counter = new ethers.Contract(CONTRACT_ADDRESS, CounterABI.abi, signer);
            setContract(counter);
        } else {
            alert("Please install MetaMask!");
        }
    };

    const getCount = async () => {
        if (contract) {
            const value = await contract.x();
            setCount(Number(value));
        }
    };

    const increment = async () => {
        if (contract) {
            const tx = await contract.inc();
            await tx.wait();
            getCount();
        }
    };

    const incrementBy = async (by: number) => {
        if (contract) {
            const tx = await contract.incBy(by);
            await tx.wait();
            getCount();
        }
    };

    useEffect(() => {
        if (contract) getCount();
    }, [contract]);

    return (
        <div style={{ padding: 20 }}>
            {!account ? (
                <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <div>
                    <p>Connected: {account}</p>
                    <p>Counter Value: {count}</p>
                    <button onClick={increment}>+1</button>
                    <button onClick={() => incrementBy(5)}>+5</button>
                </div>
            )}
        </div>
    );
}

export default TestSM;
