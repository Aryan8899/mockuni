const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const Endpoint = await hre.ethers.getContractFactory("CustomEndpoint");
  const endpoint = await Endpoint.deploy();
  await endpoint.deployed();
  console.log("Endpoint deployed at:", endpoint.address);

  const Sender = await hre.ethers.getContractFactory("SenderContract");
  const sender = await Sender.deploy(endpoint.address);
  await sender.deployed();
  console.log("Sender deployed at:", sender.address);

  const Receiver = await hre.ethers.getContractFactory("ReceiverContract");
  const receiver = await Receiver.deploy();
  await receiver.deployed();
  console.log("Receiver deployed at:", receiver.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
