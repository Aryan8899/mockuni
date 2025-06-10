const hre = require("hardhat");

async function main() {
  // Configuration - Updated with new deployment addresses
  const SENDER_ADDRESS = "0x4d4676E33D55E630709fbC54e7869F8462cB09aC";
  const RECEIVER_ADDRESS_TAN = "0x7776EeA65F1D389B61435269c0834a7fC725c425";
  const TAN_CHAIN_ID = 4442;
  
  const message = "Hello TAN from Sepolia! 🌉";

  const [deployer] = await hre.ethers.getSigners();
  const sender = await hre.ethers.getContractAt("SenderContract", SENDER_ADDRESS);

  console.log(`Sending message from ${deployer.address}`);
  console.log(`Message: "${message}"`);
  console.log(`To: Chain ${TAN_CHAIN_ID}, Contract ${RECEIVER_ADDRESS_TAN}`);

  const tx = await sender.sendMessage(
    TAN_CHAIN_ID, 
    RECEIVER_ADDRESS_TAN, 
    message
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});