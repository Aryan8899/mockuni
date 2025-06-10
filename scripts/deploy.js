// deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying from: ${deployer.address}`);

  const networkName = hre.network.name;
  console.log(`Network: ${networkName}`);

  // 1. Deploy CustomEndpoint on both networks
  const CustomEndpoint = await hre.ethers.getContractFactory("CustomEndpoint");
  const endpoint = await CustomEndpoint.deploy();
  await endpoint.deployed();
  console.log(`CustomEndpoint deployed to: ${endpoint.address}`);

  // Branch depending on the network
  if (networkName === "tan") {
    // 2. Deploy ReceiverContract on TAN
    const Receiver = await hre.ethers.getContractFactory("ReceiverContract");
    const receiver = await Receiver.deploy();
    await receiver.deployed();
    console.log(`ReceiverContract deployed to: ${receiver.address}`);
    
    console.log("\n🔥 TAN Deployment Complete!");
    console.log("Next steps:");
    console.log("1. Update RECEIVER_ADDRESS_TAN in deploy script");
    console.log("2. Deploy on Sepolia");
    console.log("3. Set up relayer service");
    
  } else if (networkName === "sepolia") {
    // Update this with actual receiver address from TAN deployment
    const RECEIVER_ADDRESS_TAN = "0x7776EeA65F1D389B61435269c0834a7fC725c425";
    
    // 3. Deploy SenderContract on Sepolia
    const Sender = await hre.ethers.getContractFactory("SenderContract");
    const sender = await Sender.deploy(endpoint.address);
    await sender.deployed();
    console.log(`SenderContract deployed to: ${sender.address}`);

    // 4. Configure chain mappings
    const TAN_CHAIN_ID = 4442; // Define your TAN chain ID
    const setTx = await endpoint.setRemoteApp(TAN_CHAIN_ID, RECEIVER_ADDRESS_TAN);
    await setTx.wait();
    console.log(`Linked TAN chain (ID: ${TAN_CHAIN_ID}) to receiver: ${RECEIVER_ADDRESS_TAN}`);
    
    console.log("\n🔥 Sepolia Deployment Complete!");
    console.log("Configuration:");
    console.log(`- Endpoint: ${endpoint.address}`);
    console.log(`- Sender: ${sender.address}`);
    console.log(`- TAN Receiver: ${RECEIVER_ADDRESS_TAN}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
