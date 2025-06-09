// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReceiverContract {
    string public lastMessage;
    event MessageReceived(string message);

    function lzReceive(uint16, bytes calldata, bytes calldata payload) external {
        string memory msgDecoded = abi.decode(payload, (string));
        lastMessage = msgDecoded;
        emit MessageReceived(msgDecoded);
    }
}
