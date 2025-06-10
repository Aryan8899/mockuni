require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    },
    tan: {
      url: "https://tan-devnetrpc2.tan.live",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4442,
    },
  },
};