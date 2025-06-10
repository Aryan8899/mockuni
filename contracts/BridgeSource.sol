// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMockLayerZeroEndpoint {
    function send(uint16 _dstChainId, bytes calldata _payload) external;
}

contract BridgeSource {
    IMockLayerZeroEndpoint public endpoint;

    constructor(address _endpoint) {
        endpoint = IMockLayerZeroEndpoint(_endpoint);
    }

    function sendMessage(uint16 dstChainId, string calldata message) external {
        bytes memory payload = abi.encode(msg.sender, message);
        endpoint.send(dstChainId, payload);
    }
}