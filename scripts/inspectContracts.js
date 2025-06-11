const hre = require("hardhat");

async function main() {
  const networkName = hre.network.name;
  console.log(`🔍 Inspecting contracts on ${networkName}...`);

  if (networkName === "sepolia") {
    const senderAddress = "0x9e9cdbA0D0D542f8889C03a398CF118DDA7aAe40";
    console.log(`\n📤 SEPOLIA SENDER: ${senderAddress}`);
    
    try {
      const sender = await hre.ethers.getContractAt("SenderContract", senderAddress);
      const contractInterface = sender.interface;
      
      console.log("\n🔧 Available Functions:");
      Object.keys(contractInterface.functions).forEach(func => {
        console.log(`   - ${func}`);
      });
      
      console.log("\n📡 Available Events:");
      Object.keys(contractInterface.events).forEach(event => {
        console.log(`   - ${event}`);
      });
      
    } catch (error) {
      console.log(`❌ Error inspecting sender: ${error.message}`);
    }

  } else if (networkName === "tan") {
    const receiverAddress = "0x084092Aea201384d46971502E481773348B5d0B8";
    console.log(`\n📥 TAN RECEIVER: ${receiverAddress}`);
    
    try {
      const receiver = await hre.ethers.getContractAt("ReceiverContract", receiverAddress);
      const contractInterface = receiver.interface;
      
      console.log("\n🔧 Available Functions:");
      Object.keys(contractInterface.functions).forEach(func => {
        console.log(`   - ${func}`);
      });
      
      console.log("\n📡 Available Events:");
      Object.keys(contractInterface.events).forEach(event => {
        console.log(`   - ${event}`);
      });
      
    } catch (error) {
      console.log(`❌ Error inspecting receiver: ${error.message}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });