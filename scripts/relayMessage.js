const hre = require("hardhat");

async function main() {
  const ENDPOINT_ADDRESS_TAN = "0x2F94C02ff226b54dA3cBf06D1e0893eE12e42773"; // Updated TAN endpoint address
  const RECEIVER_ADDRESS_TAN = "0x7776EeA65F1D389B61435269c0834a7fC725c425";
  const SENDER_ADDRESS_SEPOLIA = "0x4d4676E33D55E630709fbC54e7869F8462cB09aC";
  
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