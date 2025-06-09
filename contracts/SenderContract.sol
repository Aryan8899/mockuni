// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICustomEndpoint {
    function send(uint16 dstChainId, bytes calldata dstAddress, bytes calldata payload) external payable;
}

contract SenderContract {
    ICustomEndpoint public endpoint;

    constructor(address _endpoint) {
        endpoint = ICustomEndpoint(_endpoint);
    }

    function sendMessage(uint16 dstChainId, bytes calldata dstAddress, string calldata message) external payable {
        bytes memory payload = abi.encode(message);
        endpoint.send(dstChainId, dstAddress, payload);
    }
}
