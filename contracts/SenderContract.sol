
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICustomEndpoint {
    function send(uint256 dstChainId, address dstAddress, bytes calldata payload) external payable;
}

contract SenderContract {
    ICustomEndpoint public endpoint;
    
    event MessageSent(uint256 dstChainId, address dstAddress, string message);

    constructor(address _endpoint) {
        endpoint = ICustomEndpoint(_endpoint);
    }

    function sendMessage(uint256 dstChainId, address dstAddress, string calldata message) external payable {
        bytes memory payload = abi.encode(message);
        endpoint.send{value: msg.value}(dstChainId, dstAddress, payload);
        emit MessageSent(dstChainId, dstAddress, message);
    }
    
    // Convenience function for sending to a known receiver
    function sendMessageToReceiver(uint256 dstChainId, string calldata message) external payable {
        // This would use the remoteApps mapping from endpoint
        bytes memory payload = abi.encode(message);
        endpoint.send{value: msg.value}(dstChainId, address(0), payload); // address(0) means use remoteApps mapping
        emit MessageSent(dstChainId, address(0), message);
    }
}