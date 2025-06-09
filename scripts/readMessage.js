const hre = require("hardhat");

async function main() {
  const receiverAddress = "0xBA2085A8d2b7173358B3B297F33340B2050Ba2E2";
  const receiver = await hre.ethers.getContractAt("ReceiverContract", receiverAddress);

  const message = await receiver.lastMessage();
  console.log("Last message on TAN chain:", message);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
