const hre = require("hardhat");

async function main() {
    const network = hre.network.name;
    console.log(`🔍 Monitoring cross-chain events on ${network}...`);
    
    // Contract addresses - NOW USING THE CORRECT ONES!
    let senderAddress, receiverAddress, endpointAddress;
    
    if (network === "sepolia") {
        senderAddress = "0x9e9cdbA0D0D542f8889C03a398CF118DDA7aAe40";  // This emits events!
        receiverAddress = "0x084092Aea201384d46971502E481773348B5d0B8";
        endpointAddress = "0x3B139c93c28141A0407a849A6370606E1A345a87";
        
        console.log(`📋 Current Contract Addresses:`);
        console.log(`- Sepolia Endpoint: ${endpointAddress}`);
        console.log(`- Sepolia Sender: ${senderAddress} ⭐ (MONITORING THIS ONE)`);
        console.log(`- TAN Receiver: ${receiverAddress}`);
        
    } else if (network === "tan") {
        endpointAddress = "0xEc03D8B531259f2214CDD844550652808Ff8c7B6";
        receiverAddress = "0x084092Aea201384d46971502E481773348B5d0B8"; // This emits events!
        senderAddress = "0x9e9cdbA0D0D542f8889C03a398CF118DDA7aAe40";
        
        console.log(`📋 Current Contract Addresses:`);
        console.log(`- TAN Endpoint: ${endpointAddress}`);
        console.log(`- TAN Receiver: ${receiverAddress} ⭐ (MONITORING THIS ONE)`);
        console.log(`- Sepolia Sender: ${senderAddress}`);
    }
    
    // Get the CONTRACT THAT ACTUALLY EMITS EVENTS
    let monitorContract;
    let contractName;
    
    if (network === "sepolia") {
        // Monitor the Sender contract on Sepolia
        const CrossChainSender = await hre.ethers.getContractFactory("SenderContract");
        monitorContract = CrossChainSender.attach(senderAddress);
        contractName = "SenderContract";
    } else if (network === "tan") {
        // Monitor the Receiver contract on TAN
        const CrossChainReceiver = await hre.ethers.getContractFactory("ReceiverContract");
        monitorContract = CrossChainReceiver.attach(receiverAddress);
        contractName = "ReceiverContract";
    }
    
    console.log(`\n🎯 Monitoring contract: ${contractName}`);
    
    // Check what events this contract has
    const contractInterface = monitorContract.interface;
    const events = Object.keys(contractInterface.events);
    console.log(`🔍 Available Events in ${contractName}:`);
    events.forEach(eventSig => {
        const event = contractInterface.events[eventSig];
        console.log(`- ${event.name}(${event.inputs.map(i => i.type).join(',')})`);
    });
    
    // Set up event listeners
    console.log(`\n🎧 Setting up event listeners...`);
    
    // Listen for ALL events from this contract
    monitorContract.on("*", (event) => {
        console.log(`\n🚀 EVENT DETECTED: ${event.event || 'Unknown'}`);
        console.log(`📅 Block: ${event.blockNumber}`);
        console.log(`🔗 Tx: ${event.transactionHash}`);
        console.log(`📊 Args:`, event.args);
        
        // Try to parse based on event name
        if (event.event === "MessageQueued" || event.args?.message) {
            console.log(`📤 MESSAGE QUEUED:`);
            console.log(`   🎯 Chain: ${event.args.dstChainId || event.args[0]}`);
            console.log(`   📧 To: ${event.args.dstAddress || event.args[1]}`);
            console.log(`   💬 Message: "${event.args.message || event.args[2]}"`);
        }
        
        if (event.event === "MessageDelivered") {
            console.log(`📥 MESSAGE DELIVERED:`);
            console.log(`   🎯 From Chain: ${event.args.srcChainId || event.args[0]}`);
            console.log(`   📧 From: ${event.args.srcAddress || event.args[1]}`);
            console.log(`   💬 Message: "${event.args.message || event.args[3]}"`);
        }
    });
    
    // Also set up specific event listeners if they exist
    try {
        if (events.some(e => e.includes('MessageQueued'))) {
            monitorContract.on("MessageQueued", (...args) => {
                const event = args[args.length - 1]; // Last arg is event object
                console.log(`\n✅ MessageQueued Event:`);
                console.log(`   Chain: ${args[0]}`);
                console.log(`   To: ${args[1]}`);
                console.log(`   Message: "${args[2]}"`);
                console.log(`   Block: ${event.blockNumber}`);
            });
            console.log(`✅ Listening for MessageQueued events`);
        }
    } catch (e) {
        console.log(`⚠️ MessageQueued event not found in contract`);
    }
    
    try {
        if (events.some(e => e.includes('MessageDelivered'))) {
            monitorContract.on("MessageDelivered", (...args) => {
                const event = args[args.length - 1];
                console.log(`\n✅ MessageDelivered Event:`);
                console.log(`   From Chain: ${args[0]}`);
                console.log(`   From: ${args[1]}`);
                console.log(`   To: ${args[2]}`);
                console.log(`   Message: "${args[3]}"`);
                console.log(`   Block: ${event.blockNumber}`);
            });
            console.log(`✅ Listening for MessageDelivered events`);
        }
    } catch (e) {
        console.log(`⚠️ MessageDelivered event not found in contract`);
    }
    
    console.log(`\n🔄 Monitoring started! Send a message now...`);
    console.log(`Press Ctrl+C to stop monitoring...`);
    
    // Keep the process running
    process.stdin.resume();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});