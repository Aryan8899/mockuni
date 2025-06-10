// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BridgeTarget {
    event MessageReceived(address indexed sender, string message, bytes32 txHash);

    function receiveMessage(bytes calldata payload) external {
        (address sender, string memory message) = abi.decode(payload, (address, string));
        emit MessageReceived(sender, message, blockhash(block.number - 1));
    }
}