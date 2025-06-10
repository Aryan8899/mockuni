const hre = require("hardhat");

async function main() {
  const ENDPOINT_ADDRESS_TAN = "0x4d8563C956Bb6BfCA42D8f205aA6f97512b15928"; // Updated TAN endpoint address
  const RECEIVER_ADDRESS_TAN = "0xD41012316E5ce1A7C5cbF561F4974C4C818b25FC";
  const SENDER_ADDRESS_SEPOLIA = "0xB03057918a4232AD53aEc3E03F7ea2d1cBF3dc1d";
  
  const message = "Hello TAN from Sepolia! 🌉";
  const payload = hre.ethers.utils.defaultAbiCoder.encode(["string"], [message]);
  
  // Generate message hash for replay protection
  const messageHash = hre.ethers.utils.keccak256(
    hre.ethers.utils.defaultAbiCoder.encode(
      ["uint16", "address", "address", "bytes", "uint256"],
      [11155111, SENDER_ADDRESS_SEPOLIA, RECEIVER_ADDRESS_TAN, payload, Date.now()]
    )
  );

  const [relayer] = await hre.ethers.getSigners();
  const endpoint = await hre.ethers.getContractAt("CustomEndpoint", ENDPOINT_ADDRESS_TAN);

  console.log("🚀 Relaying message to TAN...");
  
  const tx = await endpoint.deliver(
    11155111, // Sepolia chain ID
    SENDER_ADDRESS_SEPOLIA,
    RECEIVER_ADDRESS_TAN,
    payload,
    messageHash
  );
  const receipt = await tx.wait();

  console.log("✅ Message delivered successfully!");
  console.log(`Tx Hash: ${receipt.transactionHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});