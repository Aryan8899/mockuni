const hre = require("hardhat");

async function main() {
  const senderAddress = "0x1500299Dd99A4c0F7321e864438cCFa0AdB404bd";
  const targetChainId = 4442; // TAN testnet ID (you define this arbitrarily in your setup)
  const receiverAddress = "0xBA2085A8d2b7173358B3B297F33340B2050Ba2E2";
  const message = "Hello TAN from Sepolia";

  const [deployer] = await hre.ethers.getSigners();
  const sender = await hre.ethers.getContractAt("SenderContract", senderAddress);

  const tx = await sender.sendMessage(targetChainId, receiverAddress, message);
  const receipt = await tx.wait();

  console.log("Message sent from Sepolia → TAN:", message);
  console.log(`Tx Hash on Sepolia: ${receipt.transactionHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

