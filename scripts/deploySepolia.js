const { ethers } = require("hardhat");

async function main() {
  const Endpoint = await ethers.getContractFactory("MockLayerZeroEndpoint");
  const endpoint = await Endpoint.deploy();
  await endpoint.deployed();
  console.log("Endpoint deployed to:", endpoint.address);

  const BridgeSource = await ethers.getContractFactory("BridgeSource");
  const bridge = await BridgeSource.deploy(endpoint.address);
  await bridge.deployed();
  console.log("BridgeSource deployed to:", bridge.address);
}

main().catch(console.error);
