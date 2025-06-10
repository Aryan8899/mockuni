const hre = require("hardhat");

async function main() {
  const RECEIVER_ADDRESS = "0xD41012316E5ce1A7C5cbF561F4974C4C818b25FC"; // Updated receiver address
  
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