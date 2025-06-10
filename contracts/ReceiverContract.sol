
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReceiverContract {
    string public lastMessage;
    address public lastSender;
    uint16 public lastSrcChainId;
    
    event MessageReceived(string message, address sender, uint16 srcChainId);

    function lzReceive(uint16 srcChainId, bytes calldata srcAddress, bytes calldata payload) external {
        string memory msgDecoded = abi.decode(payload, (string));
        address senderAddress = abi.decode(srcAddress, (address));
        
        lastMessage = msgDecoded;
        lastSender = senderAddress;
        lastSrcChainId = srcChainId;
        
        emit MessageReceived(msgDecoded, senderAddress, srcChainId);
    }
    
    function getLastMessageInfo() external view returns (string memory, address, uint16) {
        return (lastMessage, lastSender, lastSrcChainId);
    }
}
