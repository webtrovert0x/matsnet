import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config.js";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.20",
    settings: {
      evmVersion: "paris"
    }
  },
  networks: {
    matsnet: {
      url: "https://rpc.test.mezo.org",
      chainId: 31611,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
