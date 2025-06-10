const { ethers } = require("hardhat");

async function main() {
  const bridgeAddr = "0xbCfcd391AE46575C0839094598c73a3E61069E1E";
  const endpointAddr = "0x17A844d2A652c3B6E10f6B63b40d54B66E704cCA";

  const BridgeSource = await ethers.getContractAt("BridgeSource", bridgeAddr);
  const Endpoint = await ethers.getContractAt("MockLayerZeroEndpoint", endpointAddr);

  const dstChainId = 4442;
  const message = "Hello from Sepolia again!";

  const tx = await BridgeSource.sendMessage(dstChainId, message);
  const receipt = await tx.wait();

  console.log("✅ Message sent! Tx hash:", receipt.transactionHash);

  // Look for MessageSent event from the Endpoint contract
  const logs = await Endpoint.queryFilter("MessageSent", receipt.blockNumber, receipt.blockNumber);
  if (logs.length > 0) {
    const payload = logs[0].args.payload;
    console.log("📦 Encoded Payload:", payload);
  } else {
    console.log("⚠️ Event not found in Endpoint contract.");
  }
}

main().catch(console.error);
