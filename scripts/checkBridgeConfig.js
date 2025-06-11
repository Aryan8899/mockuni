const hre = require("hardhat");

async function main() {
  const networkName = hre.network.name;
  console.log(`🔍 Checking bridge configuration on ${networkName}...`);

  if (networkName === "sepolia") {
    // Check Sepolia Sender
    const senderAddress = "0x9e9cdbA0D0D542f8889C03a398CF118DDA7aAe40";
    const sender = await hre.ethers.getContractAt("SenderContract", senderAddress);
    
    console.log("📤 SEPOLIA SENDER ANALYSIS:");
    console.log(`   Contract: ${senderAddress}`);
    
    try {
      // Try to identify contract functions
      console.log("\n🔍 Analyzing contract interface...");
      
      // Check what functions are available
      const contractInterface = sender.interface;
      const functions = Object.keys(contractInterface.functions);
      console.log(`   Available functions: ${functions.join(', ')}`);
      
      // Try different ways to get endpoint
      let endpoint = null;
      const possibleEndpointFunctions = ['lzEndpoint', 'endpoint', 'layerZeroEndpoint', 'getEndpoint'];
      
      for (const func of possibleEndpointFunctions) {
        try {
          if (functions.includes(func + '()')) {
            endpoint = await sender[func]();
            console.log(`   LayerZero Endpoint (via ${func}): ${endpoint}`);
            break;
          }
        } catch (e) {
          // Continue to next function
        }
      }
      
      if (!endpoint) {
        console.log(`   ❓ Could not determine LayerZero endpoint`);
      }
      
      // Try to check trusted remotes
      const tanChainId = 4442;
      const possibleTrustedFunctions = ['trustedRemoteLookup', 'trustedRemotes', 'getTrustedRemote'];
      
      let foundTrustedRemote = false;
      for (const func of possibleTrustedFunctions) {
        try {
          if (functions.includes(func + '(uint256)') || functions.includes(func + '(uint16)')) {
            const trustedRemote = await sender[func](tanChainId);
            console.log(`   Trusted Remote for TAN (${tanChainId}) via ${func}: ${trustedRemote}`);
            
            const expectedRemote = "0x084092Aea201384d46971502E481773348B5d0B8".toLowerCase();
            const isCorrect = trustedRemote.toLowerCase().includes(expectedRemote);
            console.log(`   Expected: ${expectedRemote}`);
            console.log(`   ✅ Trusted Remote Configured: ${isCorrect}`);
            
            if (!isCorrect) {
              console.log(`   ❌ ISSUE: Trusted remote not set correctly!`);
            }
            foundTrustedRemote = true;
            break;
          }
        } catch (e) {
          // Continue to next function
        }
      }
      
      if (!foundTrustedRemote) {
        console.log(`   ❓ Could not check trusted remote configuration`);
      }
      
      // Check recent events
      console.log("\n📊 Recent MessageSent Events:");
      const filter = sender.filters.MessageSent();
      const events = await sender.queryFilter(filter, -50);
      console.log(`   Found ${events.length} events in last 50 blocks`);
      
      events.slice(-3).forEach((event, index) => {
        console.log(`   Event ${index + 1}:`);
        console.log(`     Tx: ${event.transactionHash}`);
        console.log(`     Block: ${event.blockNumber}`);
        console.log(`     Message: "${event.args.message}"`);
        console.log(`     To Chain: ${event.args.dstChainId.toString()}`);
      });
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

  } else if (networkName === "tan") {
    // Check TAN Receiver
    const receiverAddress = "0x084092Aea201384d46971502E481773348B5d0B8";
    const receiver = await hre.ethers.getContractAt("ReceiverContract", receiverAddress);
    
    console.log("📥 TAN RECEIVER ANALYSIS:");
    console.log(`   Contract: ${receiverAddress}`);
    
    try {
      // Try to identify contract functions
      console.log("\n🔍 Analyzing contract interface...");
      
      // Check what functions are available
      const contractInterface = receiver.interface;
      const functions = Object.keys(contractInterface.functions);
      console.log(`   Available functions: ${functions.join(', ')}`);
      
      // Try different ways to get endpoint
      let endpoint = null;
      const possibleEndpointFunctions = ['lzEndpoint', 'endpoint', 'layerZeroEndpoint', 'getEndpoint'];
      
      for (const func of possibleEndpointFunctions) {
        try {
          if (functions.includes(func + '()')) {
            endpoint = await receiver[func]();
            console.log(`   LayerZero Endpoint (via ${func}): ${endpoint}`);
            break;
          }
        } catch (e) {
          // Continue to next function
        }
      }
      
      if (!endpoint) {
        console.log(`   ❓ Could not determine LayerZero endpoint`);
      }
      
      // Try to check trusted remotes
      const sepoliaChainId = 11155111;
      const possibleTrustedFunctions = ['trustedRemoteLookup', 'trustedRemotes', 'getTrustedRemote'];
      
      let foundTrustedRemote = false;
      for (const func of possibleTrustedFunctions) {
        try {
          if (functions.includes(func + '(uint256)') || functions.includes(func + '(uint16)')) {
            const trustedRemote = await receiver[func](sepoliaChainId);
            console.log(`   Trusted Remote for Sepolia (${sepoliaChainId}) via ${func}: ${trustedRemote}`);
            
            const expectedRemote = "0x9e9cdbA0D0D542f8889C03a398CF118DDA7aAe40".toLowerCase();
            const isCorrect = trustedRemote.toLowerCase().includes(expectedRemote);
            console.log(`   Expected: ${expectedRemote}`);
            console.log(`   ✅ Trusted Remote Configured: ${isCorrect}`);
            
            if (!isCorrect) {
              console.log(`   ❌ ISSUE: Trusted remote not set correctly!`);
            }
            foundTrustedRemote = true;
            break;
          }
        } catch (e) {
          // Continue to next function
        }
      }
      
      if (!foundTrustedRemote) {
        console.log(`   ❓ Could not check trusted remote configuration`);
      }
      
      // Check recent events
      console.log("\n📊 Recent MessageReceived Events:");
      const filter = receiver.filters.MessageReceived();
      const events = await receiver.queryFilter(filter, -50);
      console.log(`   Found ${events.length} events in last 50 blocks`);
      
      if (events.length === 0) {
        console.log(`   ❌ NO CROSS-CHAIN MESSAGES RECEIVED!`);
        console.log(`   💡 This confirms the bridge is not working`);
      } else {
        events.slice(-3).forEach((event, index) => {
          console.log(`   Event ${index + 1}:`);
          console.log(`     Tx: ${event.transactionHash}`);
          console.log(`     Block: ${event.blockNumber}`);
          console.log(`     Message: "${event.args[0]}"`);
          console.log(`     From: ${event.args[1]}`);
        });
      }
      
      // Check current state
      console.log("\n📖 Current State:");
      const lastMessage = await receiver.lastMessage();
      const lastSender = await receiver.lastSender();
      const lastSrcChainId = await receiver.lastSrcChainId();
      
      console.log(`   Last Message: "${lastMessage}"`);
      console.log(`   Last Sender: ${lastSender}`);
      console.log(`   Last Source Chain: ${lastSrcChainId}`);
      
      if (lastMessage.includes("Test message from direct call")) {
        console.log(`   ℹ️  This is from your direct test, not cross-chain`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });