const hre = require("hardhat");

async function main() {
  const receiverAddress = "0xBA2085A8d2b7173358B3B297F33340B2050Ba2E2";
  const message = "Hello TAN from Sepolia";

  const payload = hre.ethers.utils.defaultAbiCoder.encode(["string"], [message]);

  const [deployer] = await hre.ethers.getSigners();
  const receiver = await hre.ethers.getContractAt("ReceiverContract", receiverAddress);

  const tx = await receiver.lzReceive(
    4442, // source chain ID (mock)
    hre.ethers.utils.hexlify(deployer.address), // dummy source address
    payload
  );
  const receipt = await tx.wait();

  console.log("Message relayed and written on TAN chain.");
  console.log(`Tx Hash on TAN: ${receipt.transactionHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
