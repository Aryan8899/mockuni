const hre = require("hardhat");

async function main() {
  const RECEIVER_ADDRESS = "0x7776EeA65F1D389B61435269c0834a7fC725c425"; // Updated receiver address
  
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