/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import QuestTokenNFT from "../abi/QuestTokenNFT.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function TestSM() {
    const [account, setAccount] = useState<string>();
    const [contract, setContract] = useState<ethers.Contract>();
    const [jobs, setJobs] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [npcRewards, setNpcRewards] = useState<any[]>([]);
    const [portfolios, setPortfolios] = useState<any[]>([]);
    const [tokenBalance, setTokenBalance] = useState<string>("0");
    const [loading, setLoading] = useState(false);

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

            const questContract = new ethers.Contract(CONTRACT_ADDRESS, QuestTokenNFT.abi, signer);
            console.log("📄 QuestTokenNFT contract instance:", questContract);

            setContract(questContract);
        } else {
            alert("Please install MetaMask!");
        }
    };


    const getMyJobs = async () => {
        if (contract) {
            try {
                setLoading(true);
                const myJobs = await contract.getallMyPublishedJob();
                console.log("📊 My published jobs:", myJobs);
                setJobs(myJobs);
            } catch (err) {
                console.error("❌ Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const publishJob = async () => {
        if (contract) {
            try {
                setLoading(true);
                console.log("📝 Publishing job...");
                const value = ethers.parseEther("0.1"); // 0.1 ETH
                const documentURI = "https://example.com/job-document";
                const assetHash = ethers.keccak256(ethers.toUtf8Bytes("sample-asset"));

                const tx = await contract.publishJob(value, documentURI, assetHash, {
                    value: ethers.parseEther("0.032") // fee
                });
                console.log("⏳ Transaction hash:", tx.hash);
                await tx.wait();
                console.log("✅ Job published!");
                getMyJobs();
            } catch (err) {
                console.error("❌ Error publishing job:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const claimJob = async (jobId: number) => {
        if (contract && account) {
            try {
                setLoading(true);
                console.log(`📝 Claiming job ${jobId}...`);
                console.log("👤 Current account:", account);

                // Check if we can claim this job (might need to be different from publisher)
                const jobs = await contract.getallMyPublishedJob();
                const job = jobs.find((j: any) => Number(j.id) === jobId);
                if (job && job.owner.toLowerCase() === account.toLowerCase()) {
                    alert("❌ You cannot claim your own job! You need another account to claim this job.");
                    return;
                }

                const tx = await contract.claimToTakeOfferedJob(jobId);
                console.log("⏳ Transaction hash:", tx.hash);
                await tx.wait();
                console.log("✅ Job claimed!");
                getMyJobs();
                getUserTokenBalance(); // Refresh token balance after claiming
            } catch (err) {
                console.error("❌ Error claiming job:", err);

                // Try the token version as backup
                try {
                    console.log("🔄 Trying claimToTakeOfferedJobToken instead...");
                    const tx = await contract.claimToTakeOfferedJobToken(jobId, 0); // 0 as pairedJobId for now
                    console.log("⏳ Transaction hash:", tx.hash);
                    await tx.wait();
                    console.log("✅ Job claimed with token method!");
                    getMyJobs();
                    getUserTokenBalance();
                } catch (err2) {
                    console.error("❌ Both claim methods failed:", err2);
                    alert("❌ Unable to claim job. You might need to use a different account or the job might have specific requirements.");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    // Disconnect wallet function
    const disconnectWallet = () => {
        setAccount(undefined);
        setContract(undefined);
        setJobs([]);
        setAssets([]);
        setNpcRewards([]);
        setPortfolios([]);
        setTokenBalance("0");
        console.log("🔌 Wallet disconnected and state reset");
    };

    // Switch account function
    const switchAccount = async () => {
        if ((window as any).ethereum) {
            try {
                // Request account access again to allow switching
                const accounts = await (window as any).ethereum.request({
                    method: "eth_requestAccounts"
                });

                if (accounts[0] !== account) {
                    console.log("🔄 Account switched from", account, "to", accounts[0]);
                    setAccount(accounts[0]);

                    // Reconnect with new account
                    const provider = new ethers.BrowserProvider((window as any).ethereum);
                    const signer = await provider.getSigner();
                    const questContract = new ethers.Contract(CONTRACT_ADDRESS, QuestTokenNFT.abi, signer);
                    setContract(questContract);

                    // Reset data
                    setJobs([]);
                    setAssets([]);
                    setNpcRewards([]);
                    setPortfolios([]);
                    setTokenBalance("0");

                    console.log("✅ Switched to new account and reconnected");
                } else {
                    alert("🔄 Please select a different account in MetaMask first, then click this button again");
                }
            } catch (err) {
                console.error("❌ Error switching account:", err);
            }
        }
    };

    // Get user token balance
    const getUserTokenBalance = async () => {
        if (contract && account) {
            try {
                const balance = await contract.getUserTokenBalance(account);
                console.log("🪙 User token balance:", balance.toString());
                setTokenBalance(balance.toString());
                return balance;
            } catch (err) {
                console.error("❌ Error getting token balance:", err);
                return 0;
            }
        }
        return 0;
    };

    // Asset functions
    const mintAssetNFT = async () => {
        if (contract && account) {
            try {
                setLoading(true);
                console.log("🎨 Minting asset NFT...");

                // Check token balance first
                const balance = await getUserTokenBalance();
                console.log("🪙 Current token balance:", balance.toString());

                if (balance === 0n) {
                    alert("❌ You need tokens to mint an asset NFT. Please complete a job first to earn tokens!");
                    return;
                }

                const documentURI = "https://example.com/asset-metadata.json";
                const assetHash = ethers.keccak256(ethers.toUtf8Bytes("sample-asset-data"));
                const sign = ethers.toUtf8Bytes(""); // Empty bytes array

                // Use exactly half of current balance to ensure it's less than available
                const priceAsset = balance / 2n;

                console.log("💰 Using price:", priceAsset.toString(), "which is half of balance:", balance.toString());

                console.log("📊 Parameters:", {
                    documentURI,
                    assetHash,
                    sign,
                    priceAsset: priceAsset.toString(),
                    account,
                    tokenBalance: balance.toString()
                });

                // First try to estimate gas to see if the transaction would succeed
                console.log("🔍 Estimating gas...");
                const gasEstimate = await contract.mintAssetNFT.estimateGas(documentURI, assetHash, sign, priceAsset);
                console.log("⛽ Gas estimate:", gasEstimate.toString());

                const tx = await contract.mintAssetNFT(documentURI, assetHash, sign, priceAsset);
                console.log("⏳ Transaction hash:", tx.hash);
                const receipt = await tx.wait();
                console.log("✅ Asset NFT minted!");

                // Get the tokenId from the event logs
                const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id("Transfer(address,address,uint256)"));
                if (event) {
                    const tokenId = parseInt(event.topics[3], 16);
                    console.log("🆔 Token ID:", tokenId);
                }

                getAssets();
            } catch (err) {
                console.error("❌ Error minting asset NFT:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    // NPC Reward functions
    const mintNPCRewardNFT = async () => {
        if (contract && account) {
            try {
                setLoading(true);
                console.log("🎁 Minting NPC Reward NFT...");

                const value = ethers.parseEther("0.02"); // 0.02 ETH value for the reward
                const assetHash = ethers.keccak256(ethers.toUtf8Bytes("npc-reward-" + Date.now()));

                console.log("📊 NPC Reward Parameters:", {
                    value: value.toString(),
                    assetHash,
                    account
                });

                // Estimate gas first
                console.log("🔍 Estimating gas for NPC reward...");
                const gasEstimate = await contract.mintNPCRewardNFT.estimateGas(value, assetHash);
                console.log("⛽ Gas estimate:", gasEstimate.toString());

                const tx = await contract.mintNPCRewardNFT(value, assetHash);
                console.log("⏳ Transaction hash:", tx.hash);
                const receipt = await tx.wait();
                console.log("✅ NPC Reward NFT minted!");

                // Get the tokenId from the event logs
                const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id("Transfer(address,address,uint256)"));
                if (event) {
                    const tokenId = parseInt(event.topics[3], 16);
                    console.log("🆔 NPC Reward Token ID:", tokenId);
                }

                getNPCRewards();
                getUserTokenBalance();
            } catch (err) {
                console.error("❌ Error minting NPC Reward NFT:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const getAssets = async () => {
        if (contract && account) {
            try {
                setLoading(true);
                console.log("📊 Fetching assets...");

                // Use the new getAllAssets function
                const userAssets = await contract.getAllAssets(account);
                console.log("📊 User assets:", userAssets);

                // Convert the result to the expected format
                const formattedAssets = userAssets.map((asset: any) => ({
                    tokenId: asset.tokenId.toString(),
                    documentURI: asset.documentURI,
                    assetHash: asset.assetHash,
                    sign: asset.sign,
                    priceasset: asset.priceasset
                }));

                setAssets(formattedAssets);
            } catch (err) {
                console.error("❌ Error fetching assets:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const transferAssetNFT = async (tokenId: string, toAddress: string) => {
        if (contract) {
            try {
                setLoading(true);
                console.log(`🔄 Transferring asset NFT ${tokenId} to ${toAddress}...`);
                const tx = await contract.transferAssetNFT(tokenId, toAddress);
                console.log("⏳ Transaction hash:", tx.hash);
                await tx.wait();
                console.log("✅ Asset NFT transferred!");
                getAssets();
            } catch (err) {
                console.error("❌ Error transferring asset NFT:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const getAssetData = async (tokenId: string) => {
        if (contract) {
            try {
                setLoading(true);
                console.log(`📊 Getting asset data for token ${tokenId}...`);
                const assetData = await contract.getAssetData(tokenId);
                console.log("📊 Asset data:", assetData);
                return assetData;
            } catch (err) {
                console.error("❌ Error getting asset data:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    // NPC Rewards functions
    const getNPCRewards = async () => {
        if (contract && account) {
            try {
                setLoading(true);
                console.log("📊 Fetching NPC rewards...");

                // Use the new getAllNPCRewards function
                const userNPCRewards = await contract.getAllNPCRewards(account);
                console.log("📊 User NPC rewards:", userNPCRewards);

                // Convert the result to the expected format
                const formattedNPCRewards = userNPCRewards.map((reward: any) => ({
                    tokenId: reward.tokenId.toString(),
                    value: reward.value,
                    assetHash: reward.assetHash
                }));

                setNpcRewards(formattedNPCRewards);
            } catch (err) {
                console.error("❌ Error fetching NPC rewards:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Portfolio functions
    const getPortfolios = async () => {
        if (contract && account) {
            try {
                setLoading(true);
                console.log("📊 Fetching portfolios...");

                // Use the new getAllPortfolios function
                const userPortfolios = await contract.getAllPortfolios(account);
                console.log("📊 User portfolios:", userPortfolios);

                // Convert the result to the expected format
                const formattedPortfolios = userPortfolios.map((portfolio: any) => ({
                    tokenId: portfolio.tokenId.toString(),
                    documentURI: portfolio.documentURI,
                    value: portfolio.value,
                    assetHash: portfolio.assetHash,
                    sign: portfolio.sign
                }));

                setPortfolios(formattedPortfolios);
            } catch (err) {
                console.error("❌ Error fetching portfolios:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const mintPortfolioNFT = async () => {
        if (contract) {
            try {
                setLoading(true);
                console.log("📜 Minting Portfolio NFT...");

                const value = ethers.parseEther("0.05");
                const documentURI = "https://example.com/portfolio-metadata.json";
                const assetHash = ethers.keccak256(ethers.toUtf8Bytes("portfolio-data-" + Date.now()));
                const sign = ethers.toUtf8Bytes("");

                const tx = await contract.mintNFTPortfolio(value, documentURI, assetHash, sign);
                console.log("⏳ Transaction hash:", tx.hash);
                const receipt = await tx.wait();
                console.log("✅ Portfolio NFT minted!");

                const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id("Transfer(address,address,uint256)"));
                if (event) {
                    const tokenId = parseInt(event.topics[3], 16);
                    console.log("🆔 Portfolio Token ID:", tokenId);
                }

                getPortfolios();
                getUserTokenBalance();
            } catch (err) {
                console.error("❌ Error minting Portfolio NFT:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (contract) {
            getMyJobs();
            getAssets();
            getNPCRewards();
            getPortfolios();
            getUserTokenBalance();
        }
    }, [contract]);

    return (
        <div style={{ padding: 20 }}>
            {!account ? (
                <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div>
                            <p>Connected: {account}</p>
                            <p style={{ color: "#666", fontSize: "14px" }}>
                                🪙 Token Balance: {tokenBalance} tokens
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={switchAccount}
                                style={{
                                    padding: "5px 15px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Switch Account
                            </button>
                            <button
                                onClick={disconnectWallet}
                                style={{
                                    padding: "5px 15px",
                                    backgroundColor: "#ff4444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Disconnect Wallet
                            </button>
                        </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <h3>Job Functions</h3>
                        <button onClick={publishJob} disabled={loading}>
                            {loading ? "Publishing..." : "Publish Sample Job"}
                        </button>
                        <button onClick={getMyJobs} disabled={loading} style={{ marginLeft: 10 }}>
                            {loading ? "Loading..." : "Refresh Jobs"}
                        </button>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <h3>Asset Functions</h3>
                        <button onClick={mintAssetNFT} disabled={loading}>
                            {loading ? "Minting..." : "Mint Asset NFT"}
                        </button>
                        <button onClick={getAssets} disabled={loading} style={{ marginLeft: 10 }}>
                            {loading ? "Loading..." : "Refresh Assets"}
                        </button>
                        <button onClick={getUserTokenBalance} disabled={loading} style={{ marginLeft: 10 }}>
                            {loading ? "Loading..." : "Refresh Token Balance"}
                        </button>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <h3>NPC Reward Functions</h3>
                        <button onClick={mintNPCRewardNFT} disabled={loading} style={{
                            backgroundColor: "#ffc107",
                            color: "#212529",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}>
                            {loading ? "Minting..." : "🎁 Mint NPC Reward NFT"}
                        </button>
                        <button onClick={getNPCRewards} disabled={loading} style={{ marginLeft: 10 }}>
                            {loading ? "Loading..." : "Refresh NPC Rewards"}
                        </button>
                        <p style={{ fontSize: "12px", color: "#666", marginTop: 5 }}>
                            💡 NPC Reward NFTs can be minted without requiring tokens - perfect for game rewards!
                        </p>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <h3>Portfolio Functions</h3>
                        <button onClick={mintPortfolioNFT} disabled={loading}>
                            {loading ? "Minting..." : "Mint Portfolio NFT (Adds tokens)"}
                        </button>
                        <button onClick={getPortfolios} disabled={loading} style={{ marginLeft: 10 }}>
                            {loading ? "Loading..." : "Refresh Portfolios"}
                        </button>
                    </div>

                    <h3>My Published Jobs ({jobs.length})</h3>
                    {jobs.length === 0 ? (
                        <p>No jobs published yet</p>
                    ) : (
                        <div>
                            {jobs.map((job, index) => (
                                <div key={index} style={{
                                    border: "1px solid #ccc",
                                    padding: 10,
                                    margin: "10px 0",
                                    borderRadius: 5
                                }}>
                                    <p><strong>Job ID:</strong> {job.id.toString()}</p>
                                    <p><strong>Owner:</strong> {job.owner}</p>
                                    <p><strong>Value:</strong> {ethers.formatEther(job.value)} ETH</p>
                                    <p><strong>Document:</strong> {job.documentURI}</p>
                                    <p><strong>Status:</strong>
                                        {job.isFinished ? "Finished" : job.isTaken ? "Taken" : "Available"}
                                    </p>
                                    {!job.isTaken && !job.isFinished && (
                                        <button
                                            onClick={() => claimJob(Number(job.id))}
                                            disabled={loading}
                                        >
                                            Claim Job
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <h3>Claim Jobs from Other Accounts</h3>
                    <div style={{ marginBottom: 20, padding: 15, border: "1px solid #ddd", borderRadius: 5, backgroundColor: "#f8f9fa" }}>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: 10 }}>
                            💡 Since only "My Published Jobs" are visible, use this section to claim jobs published by other accounts.
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input
                                type="number"
                                placeholder="Enter Job ID to claim"
                                id="manual-job-id"
                                style={{ padding: "5px 10px", border: "1px solid #ccc", borderRadius: "4px", width: "200px" }}
                            />
                            <button
                                onClick={() => {
                                    const input = document.getElementById("manual-job-id") as HTMLInputElement;
                                    const jobId = parseInt(input.value);
                                    if (jobId >= 0) {
                                        claimJob(jobId);
                                        input.value = "";
                                    } else {
                                        alert("Please enter a valid Job ID");
                                    }
                                }}
                                disabled={loading}
                                style={{
                                    padding: "5px 15px",
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                {loading ? "Claiming..." : "Claim Job"}
                            </button>
                        </div>
                        <p style={{ fontSize: "12px", color: "#999", marginTop: 5 }}>
                            📝 Workflow: Account A publishes job → tells Job ID to Account B → Account B enters Job ID here to claim
                        </p>
                    </div>

                    <h3>My Asset NFTs ({assets.length})</h3>
                    {assets.length === 0 ? (
                        <p>No assets minted yet</p>
                    ) : (
                        <div>
                            {assets.map((asset, index) => (
                                <div key={index} style={{
                                    border: "1px solid #ccc",
                                    padding: 10,
                                    margin: "10px 0",
                                    borderRadius: 5,
                                    backgroundColor: "#f9f9f9"
                                }}>
                                    <p><strong>Token ID:</strong> {asset.tokenId}</p>
                                    <p><strong>Document URI:</strong> {asset.documentURI}</p>
                                    <p><strong>Asset Hash:</strong> {asset.assetHash}</p>
                                    <p><strong>Price:</strong> {ethers.formatEther(asset.priceasset)} ETH</p>
                                    <div style={{ marginTop: 10 }}>
                                        <input
                                            type="text"
                                            placeholder="Recipient address"
                                            id={`transfer-${asset.tokenId}`}
                                            style={{ marginRight: 10, padding: 5 }}
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.getElementById(`transfer-${asset.tokenId}`) as HTMLInputElement;
                                                if (input.value) {
                                                    transferAssetNFT(asset.tokenId, input.value);
                                                } else {
                                                    alert("Please enter recipient address");
                                                }
                                            }}
                                            disabled={loading}
                                            style={{ padding: 5 }}
                                        >
                                            Transfer NFT
                                        </button>
                                        <button
                                            onClick={() => getAssetData(asset.tokenId)}
                                            disabled={loading}
                                            style={{ marginLeft: 10, padding: 5 }}
                                        >
                                            Get Asset Data
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <h3>My Portfolio NFTs ({portfolios.length})</h3>
                    {portfolios.length === 0 ? (
                        <p>No portfolios minted yet</p>
                    ) : (
                        <div>
                            {portfolios.map((portfolio, index) => (
                                <div key={index} style={{
                                    border: "1px solid #ccc",
                                    padding: 10,
                                    margin: "10px 0",
                                    borderRadius: 5,
                                    backgroundColor: "#e8f4fd"
                                }}>
                                    <p><strong>Token ID:</strong> {portfolio.tokenId}</p>
                                    <p><strong>Document URI:</strong> {portfolio.documentURI}</p>
                                    <p><strong>Value:</strong> {ethers.formatEther(portfolio.value)} tokens</p>
                                    <p><strong>Asset Hash:</strong> {portfolio.assetHash}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <h3>My NPC Reward NFTs ({npcRewards.length})</h3>
                    {npcRewards.length === 0 ? (
                        <p>No NPC rewards yet</p>
                    ) : (
                        <div>
                            {npcRewards.map((reward, index) => (
                                <div key={index} style={{
                                    border: "1px solid #ccc",
                                    padding: 10,
                                    margin: "10px 0",
                                    borderRadius: 5,
                                    backgroundColor: "#fff3cd"
                                }}>
                                    <p><strong>Token ID:</strong> {reward.tokenId}</p>
                                    <p><strong>Value:</strong> {ethers.formatEther(reward.value)} tokens</p>
                                    <p><strong>Asset Hash:</strong> {reward.assetHash}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TestSM;
