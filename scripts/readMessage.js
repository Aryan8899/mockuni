const hre = require("hardhat");

async function main() {
  // Updated to use the correct receiver address (same as in relayMessage.js)
  const RECEIVER_ADDRESS = "0x084092Aea201384d46971502E481773348B5d0B8"; // Fixed address
  
  const receiver = await hre.ethers.getContractAt("ReceiverContract", RECEIVER_ADDRESS);

  const [message, sender, srcChainId] = await receiver.getLastMessageInfo();
  
  console.log("📨 Last Message Info:");
  console.log(`Message: "${message}"`);
  console.log(`From: ${sender}`);
  console.log(`Source Chain ID: ${srcChainId}`);
  
  // Also check the individual fields
  const lastMessage = await receiver.lastMessage();
  console.log(`\nDirect read - Last message: "${lastMessage}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});