const hre = require("hardhat");

async function main() {
  const RECEIVER_ADDRESS_TAN = "0x084092Aea201384d46971502E481773348B5d0B8";
  const SENDER_ADDRESS_SEPOLIA = "0x9e9cdbA0D0D542f8889C03a398CF118DDA7aAe40";
  
  console.log("🧪 Testing Receiver Contract Directly...");
  
  // 1. Check if receiver exists
  const code = await hre.ethers.provider.getCode(RECEIVER_ADDRESS_TAN);
  if (code === '0x') {
    console.log("❌ Receiver contract doesn't exist!");
    return;
  }
  
  try {
    const receiver = await hre.ethers.getContractAt("ReceiverContract", RECEIVER_ADDRESS_TAN);
    
    // 2. Check current state
    console.log("📖 Current receiver state:");
    try {
      const lastMessage = await receiver.lastMessage();
      const lastSender = await receiver.lastSender();
      const lastSrcChainId = await receiver.lastSrcChainId();
      
      console.log(`Last message: "${lastMessage}"`);
      console.log(`Last sender: ${lastSender}`);
      console.log(`Last source chain: ${lastSrcChainId}`);
    } catch (e) {
      console.log("Could not read current state:", e.message);
    }
    
    // 3. Test lzReceive function directly
    console.log("\n🧪 Testing lzReceive function...");
    const message = "Test message from direct call";
    const payload = hre.ethers.utils.defaultAbiCoder.encode(["string"], [message]);
    const srcAddress = hre.ethers.utils.defaultAbiCoder.encode(["address"], [SENDER_ADDRESS_SEPOLIA]);
    
    try {
      // First try static call
      await receiver.callStatic.lzReceive(11155111, srcAddress, payload);
      console.log("✅ Static call to lzReceive succeeded");
      
      // Now try actual transaction
      const tx = await receiver.lzReceive(11155111, srcAddress, payload);
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        console.log("✅ Direct lzReceive call succeeded!");
        console.log(`Gas used: ${receipt.gasUsed.toString()}`);
        
        // Check updated state
        const newMessage = await receiver.lastMessage();
        console.log(`New message: "${newMessage}"`);
        
        if (newMessage === message) {
          console.log("✅ Message was stored correctly!");
        } else {
          console.log("❌ Message was not stored correctly");
        }
      } else {
        console.log("❌ Direct lzReceive transaction failed");
      }
      
    } catch (error) {
      console.log("❌ lzReceive failed:", error.message);
      
      // Check if it's an access control issue
      if (error.message.includes("Not authorized") || error.message.includes("Ownable")) {
        console.log("💡 This might be an access control issue in the receiver");
        console.log("💡 The receiver might only allow the endpoint to call lzReceive");
      }
    }
    
  } catch (error) {
    console.log("❌ Error interacting with receiver:", error.message);
  }
}

main().catch((error) => {
  console.error("Script failed:", error);
  process.exitCode = 1;
});