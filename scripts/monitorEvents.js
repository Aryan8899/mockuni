// ===== monitorEvents.js (UPDATED) =====
const hre = require("hardhat");

async function main() {
  // For Sepolia monitoring
  const SEPOLIA_ENDPOINT_ADDRESS = "0x7d5CFF0f4c455a917384ef68dE8C1475cF09D826";
  // For TAN monitoring  
  const TAN_ENDPOINT_ADDRESS = "0x2F94C02ff226b54dA3cBf06D1e0893eE12e42773";
  
  // Use the appropriate endpoint based on network
  const networkName = hre.network.name;
  const ENDPOINT_ADDRESS = networkName === "sepolia" ? SEPOLIA_ENDPOINT_ADDRESS : TAN_ENDPOINT_ADDRESS;
  
  const endpoint = await hre.ethers.getContractAt("CustomEndpoint", ENDPOINT_ADDRESS);
  
  console.log(`🔍 Monitoring cross-chain events on ${networkName}...`);
  console.log(`Using endpoint: ${ENDPOINT_ADDRESS}`);
  
  // Listen for MessageQueued events (on Sepolia)
  endpoint.on("MessageQueued", (dstChainId, dstAddress, payload, sender, event) => {
    console.log("\n📤 Message Queued:");
    console.log(`- Destination Chain: ${dstChainId}`);
    console.log(`- Destination Address: ${dstAddress}`);
    console.log(`- Sender: ${sender}`);
    console.log(`- Tx Hash: ${event.transactionHash}`);
  });
  
  // Listen for MessageDelivered events (on TAN)
  endpoint.on("MessageDelivered", (srcChainId, srcAddress, dstContract, payload, event) => {
    console.log("\n📥 Message Delivered:");
    console.log(`- Source Chain: ${srcChainId}`);
    console.log(`- Source Address: ${srcAddress}`);
    console.log(`- Destination Contract: ${dstContract}`);
    console.log(`- Tx Hash: ${event.transactionHash}`);
  });
  
  // Keep the script running
  console.log("Press Ctrl+C to stop monitoring...");
  await new Promise(() => {}); // Keep alive
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});