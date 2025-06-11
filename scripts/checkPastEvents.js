const hre = require("hardhat");

async function main() {
    const network = hre.network.name;
    console.log(`🔍 Finding event source on ${network}...`);
    
    // Your contract addresses
    const addresses = {
        sepolia: {
            endpoint: "0x3B139c93c28141A0407a849A6370606E1A345a87",
            sender: "0x9e9cdbA0D0D542f8889C03a398CF118DDA7aAe40"
        },
        tan: {
            endpoint: "0xEc03D8B531259f2214CDD844550652808Ff8c7B6",
            receiver: "0x084092Aea201384d46971502E481773348B5d0B8"
        }
    };
    
    const currentAddresses = addresses[network];
    if (!currentAddresses) {
        console.log("❌ Unknown network");
        return;
    }
    
    console.log(`📋 Checking contracts on ${network}:`);
    Object.entries(currentAddresses).forEach(([name, addr]) => {
        console.log(`   ${name}: ${addr}`);
    });
    
    // Get current block info
    const currentBlock = await hre.ethers.provider.getBlockNumber();
    const fromBlock = currentBlock - 100;
    console.log(`\n📊 Searching blocks ${fromBlock} to ${currentBlock}`);
    
    // Check each contract
    for (const [contractName, contractAddress] of Object.entries(currentAddresses)) {
        console.log(`\n🔍 Checking ${contractName} (${contractAddress}):`);
        
        try {
            // Try to get contract factories for different contract types
            let contractFactory;
            let contractInstance;
            
            // Try different contract types
            const contractTypes = ["CustomEndpoint", "CrossChainSender", "CrossChainReceiver"];
            
            for (const contractType of contractTypes) {
                try {
                    contractFactory = await hre.ethers.getContractFactory(contractType);
                    contractInstance = contractFactory.attach(contractAddress);
                    
                    // Try to call a simple function to verify contract type
                    if (contractType === "CustomEndpoint") {
                        await contractInstance.owner();
                        console.log(`   ✅ ${contractType} confirmed`);
                        break;
                    } else if (contractType === "CrossChainSender") {
                        await contractInstance.endpoint();
                        console.log(`   ✅ ${contractType} confirmed`);
                        break;
                    } else if (contractType === "CrossChainReceiver") {
                        await contractInstance.endpoint();
                        console.log(`   ✅ ${contractType} confirmed`);
                        break;
                    }
                } catch (e) {
                    // Contract type doesn't match, try next one
                    continue;
                }
            }
            
            if (!contractInstance) {
                console.log(`   ❌ Could not determine contract type`);
                continue;
            }
            
            // Check for events using generic event filter
            const provider = hre.ethers.provider;
            const eventFilter = {
                address: contractAddress,
                fromBlock: fromBlock,
                toBlock: currentBlock
            };
            
            const logs = await provider.getLogs(eventFilter);
            console.log(`   📊 Found ${logs.length} events`);
            
            // Try to decode events if any found
            if (logs.length > 0) {
                console.log(`   📝 Recent events:`);
                logs.slice(-3).forEach((log, index) => {
                    console.log(`     ${index + 1}. Block: ${log.blockNumber}, Tx: ${log.transactionHash}`);
                    console.log(`        Topics: ${log.topics.slice(0, 2).join(', ')}...`);
                });
                
                // Try to decode with different interfaces
                try {
                    const decoded = contractInstance.interface.parseLog(logs[logs.length - 1]);
                    console.log(`   🎯 Latest event: ${decoded.name}`);
                    console.log(`      Args:`, decoded.args);
                } catch (e) {
                    console.log(`   ⚠️ Could not decode event`);
                }
            }
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }
    
    // Also check the specific transaction hashes from your messages
    console.log(`\n🔍 Checking your recent transaction receipts:`);
    const txHashes = [
        "0x419490a45af67d691c9ad5acbe354a7b4873d20cea05f15040d43a48f32671b5",
        "0x286ecb929b8303386e6e4b150b87fc0eaf4996a06a3996e0ecfb03b6f0d7413c"
    ];
    
    for (const txHash of txHashes) {
        try {
            const receipt = await hre.ethers.provider.getTransactionReceipt(txHash);
            console.log(`\n📋 Transaction: ${txHash}`);
            console.log(`   Block: ${receipt.blockNumber}`);
            console.log(`   Events: ${receipt.logs.length}`);
            
            receipt.logs.forEach((log, index) => {
                console.log(`   ${index + 1}. Contract: ${log.address}`);
                console.log(`      Topics: ${log.topics[0]}`);
                
                // Check if this matches our contracts
                if (Object.values(currentAddresses).includes(log.address)) {
                    console.log(`      ✅ This is one of our contracts!`);
                }
            });
        } catch (error) {
            console.log(`   ❌ Could not get receipt for ${txHash}`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });