// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockLayerZeroEndpoint {
    event MessageSent(address indexed from, uint16 dstChainId, bytes payload); // <-- already exists

    function send(uint16 _dstChainId, bytes calldata _payload) external {
        emit MessageSent(msg.sender, _dstChainId, _payload); // <-- add this line
    }
}
