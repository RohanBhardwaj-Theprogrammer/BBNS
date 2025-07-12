require("@nomicfoundation/hardhat-toolbox");
const path = require('path');
const dotenv = require('dotenv');

// Dynamically resolve the path to the .env file located in the root directory (for example, bbns/.env)
const envPath = path.resolve(__dirname, '../../../.env');  // Adjust this based on your file structure

// Load the .env from the resolved path
dotenv.config({ path: envPath });

// Access the privatekey environment variable
const privateKey = process.env.privatekey;

console.log("The key in Hardhat is: ", process.env.PRIVATE_KEY);

// Task to print out accounts
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.17",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Ganache URL (usually for local development)
      accounts: [process.env.PRIVATE_KEY], // Private key from .env file
      chainId: 1337, // Default Ganache chain ID
    }
  }
};
