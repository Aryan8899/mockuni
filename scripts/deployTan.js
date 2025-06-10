const { ethers } = require("hardhat");

async function main() {
  const BridgeTarget = await ethers.getContractFactory("BridgeTarget");
  const target = await BridgeTarget.deploy();
  await target.deployed();
  console.log("BridgeTarget deployed to:", target.address);
}

main().catch(console.error);
