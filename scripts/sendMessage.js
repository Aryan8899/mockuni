const hre = require("hardhat");

async function main() {
  // Configuration - Updated with new deployment addresses
  const SENDER_ADDRESS = "0x9e9cdbA0D0D542f8889C03a398CF118DDA7aAe40";
  const RECEIVER_ADDRESS_TAN = "0x084092Aea201384d46971502E481773348B5d0B8";
  const TAN_CHAIN_ID = 4442; // This should match what's set in the endpoint
  
  const message = "Hello TAN from Sepolia! 🌉";

  const [deployer] = await hre.ethers.getSigners();
  const sender = await hre.ethers.getContractAt("SenderContract", SENDER_ADDRESS);

  console.log(`Sending message from ${deployer.address}`);
  console.log(`Balance: ${hre.ethers.utils.formatEther(await deployer.getBalance())} ETH`);
  console.log(`Message: "${message}"`);
  console.log(`To: Chain ${TAN_CHAIN_ID}, Contract ${RECEIVER_ADDRESS_TAN}`);

  try {
    // Try with manual gas limit if estimation fails
    const tx = await sender.sendMessage(
      TAN_CHAIN_ID, 
      RECEIVER_ADDRESS_TAN, 
      message,
      {
        gasLimit: 200000, // Manual gas limit
        value: 0 // No ETH needed for this operation
      }
    );
    const receipt = await tx.wait();

    console.log("✅ Message sent successfully!");
    console.log(`Tx Hash: ${receipt.transactionHash}`);
    console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
    
    // Parse events
    const events = receipt.events?.filter(e => e.event === "MessageSent");
    if (events && events.length > 0) {
      console.log("📡 Event emitted:", events[0].args);
    }
  } catch (error) {
    console.error("❌ Transaction failed:", error.message);
    
    // Debug information
    console.log("\n🔍 Debug Info:");
    console.log(`Sender contract: ${SENDER_ADDRESS}`);
    console.log(`Target chain ID: ${TAN_CHAIN_ID}`);
    console.log(`Target address: ${RECEIVER_ADDRESS_TAN}`);
    
    // Check if sender contract exists
    const code = await hre.ethers.provider.getCode(SENDER_ADDRESS);
    console.log(`Sender contract exists: ${code !== '0x'}`);
    
    // Try to get the endpoint address from sender
    try {
      const endpointAddr = await sender.endpoint();
      console.log(`Endpoint address: ${endpointAddr}`);
      
      // Check if endpoint has remote app configured
      const endpoint = await hre.ethers.getContractAt("CustomEndpoint", endpointAddr);
      const remoteApp = await endpoint.remoteApps(TAN_CHAIN_ID);
      console.log(`Remote app for chain ${TAN_CHAIN_ID}: ${remoteApp}`);
      
      if (remoteApp === "0x0000000000000000000000000000000000000000") {
        console.log("⚠️  Remote app not configured! Run deployment script first.");
      }
    } catch (debugError) {
      console.log("Debug error:", debugError.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});