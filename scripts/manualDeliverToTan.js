const { ethers } = require("hardhat");

async function main() {
  const bridgeTargetAddr = "0x184e6b7591237Ef52D0Ea414ADCD737786CB47Af";
  const BridgeTarget = await ethers.getContractAt("BridgeTarget", bridgeTargetAddr);

  const payload = "0x000000000000000000000000c285d7192174486f038a4de931cb4f99ddaef4c30000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001948656c6c6f2066726f6d205365706f6c696120616761696e2100000000000000";

  const tx = await BridgeTarget.receiveMessage(payload);
  const receipt = await tx.wait();

  console.log("✅ Message received on TAN. Tx hash:", receipt.transactionHash);
}

main().catch(console.error);
