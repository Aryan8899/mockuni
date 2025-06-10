// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReceiver {
    function lzReceive(uint256 srcChainId, bytes calldata srcAddress, bytes calldata payload) external;
}

contract CustomEndpoint {
    event MessageQueued(uint256 dstChainId, address dstAddress, bytes payload, address sender);
    event MessageDelivered(uint256 srcChainId, address srcAddress, address dstContract, bytes payload);
    
    mapping(uint256 => address) public remoteApps;
    mapping(bytes32 => bool) public processedMessages;
    
    address public owner;
    mapping(address => bool) public relayers;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyRelayer() {
        require(relayers[msg.sender], "Not authorized relayer");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        relayers[msg.sender] = true;
    }
    
    function addRelayer(address _relayer) external onlyOwner {
        relayers[_relayer] = true;
    }
    
    function removeRelayer(address _relayer) external onlyOwner {
        relayers[_relayer] = false;
    }

    function send(
        uint256 dstChainId,
        address dstAddress,
        bytes calldata payload
    ) external payable {
        require(remoteApps[dstChainId] != address(0), "Remote app not set");
        emit MessageQueued(dstChainId, dstAddress, payload, msg.sender);
    }

    function deliver(
        uint256 srcChainId,
        address srcAddress,
        address dstContract,
        bytes calldata payload,
        bytes32 messageHash
    ) external onlyRelayer {
        require(!processedMessages[messageHash], "Message already processed");
        processedMessages[messageHash] = true;
        
        IReceiver(dstContract).lzReceive(srcChainId, abi.encodePacked(srcAddress), payload);
        emit MessageDelivered(srcChainId, srcAddress, dstContract, payload);
    }

    function setRemoteApp(uint256 _chainId, address _remoteApp) external onlyOwner {
        remoteApps[_chainId] = _remoteApp;
    }
}


