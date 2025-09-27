/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CounterABI from "../abi/Counter.json";

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

function TestSM() {
    const [account, setAccount] = useState<string>();
    const [count, setCount] = useState<number>(0);
    const [contract, setContract] = useState<ethers.Contract>();

    // connect wallet
    const connectWallet = async () => {
        if ((window as any).ethereum) {
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            console.log("📡 Provider:", provider);

            const accounts = await provider.send("eth_requestAccounts", []);
            console.log("👤 Accounts:", accounts);
            setAccount(accounts[0]);

            const network = await provider.getNetwork();
            console.log("🌐 Connected network:", network);

            // pastikan chainId = 31337 (Hardhat)
            if (network.chainId !== 31337n) {
                alert(`Wrong network! Please switch MetaMask to Hardhat Localhost (31337). Current: ${network.chainId}`);
                return;
            }

            const signer = await provider.getSigner();
            console.log("✍️ Signer:", signer);

            const counter = new ethers.Contract(CONTRACT_ADDRESS, CounterABI.abi, signer);
            console.log("📄 Counter contract instance:", counter);

            setContract(counter);
        } else {
            alert("Please install MetaMask!");
        }
    };


    const getCount = async () => {
        if (contract) {
            try {
                const value = await contract.x();
                console.log("📊 Current counter value from contract:", value.toString());
                setCount(Number(value));
            } catch (err) {
                console.error("❌ Error fetching count:", err);
            }
        }
    };

    const increment = async () => {
        if (contract) {
            try {
                console.log("📝 Sending tx: contract.inc() ...");
                const tx = await contract.inc();
                console.log("⏳ Transaction hash:", tx.hash);
                await tx.wait();
                console.log("✅ Transaction confirmed!");
                getCount();
            } catch (err) {
                console.error("❌ Error increment:", err);
            }
        }
    };

    const incrementBy = async (by: number) => {
        if (contract) {
            try {
                console.log(`📝 Sending tx: contract.incBy(${by}) ...`);
                const tx = await contract.incBy(by);
                console.log("⏳ Transaction hash:", tx.hash);
                await tx.wait();
                console.log("✅ Transaction confirmed!");
                getCount();
            } catch (err) {
                console.error("❌ Error incrementBy:", err);
            }
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
