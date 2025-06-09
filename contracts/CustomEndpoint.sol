// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReceiver {
    function lzReceive(uint16 srcChainId, bytes calldata srcAddress, bytes calldata payload) external;
}

contract CustomEndpoint {
    event MessageQueued(uint16 dstChainId, bytes dstAddress, bytes payload);

    function send(
        uint16 dstChainId,
        bytes calldata dstAddress,
        bytes calldata payload
    ) external payable {
        emit MessageQueued(dstChainId, dstAddress, payload);
    }

    function deliver(
        uint16 srcChainId,
        bytes calldata srcAddress,
        address dstContract,
        bytes calldata payload
    ) external {
        IReceiver(dstContract).lzReceive(srcChainId, srcAddress, payload);
    }
}
