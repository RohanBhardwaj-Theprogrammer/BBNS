// deploy.js
require('dotenv').config(); // Load .env file from the current directory (React project)
const fs = require('fs');
const path = require('path'); // Required for absolute path resolution
const { ethers } = require("hardhat");

const main = async () => {
  // Get the deployer (account) to use for the transaction
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  // Deploy the contract
  const productContractFactory = await ethers.getContractFactory("Authentix");
  const productContract = await productContractFactory.deploy();
  await productContract.deployed();

  // Get the deployed contract address
  const contractAddress = productContract.address;

  console.log("Authentix contract deployed at address: ", contractAddress);

  // Now that we have the contract address, update the React component files
  updateReactComponentFiles(contractAddress);
};

// Function to update the React component files with the new contract address
const updateReactComponentFiles = (contractAddress) => {
  const files = [
    path.resolve(__dirname, '..\\..\\identeefi-frontend-react\\src\\components\\pages\\UpdateProductDetails.jsx'),
    path.resolve(__dirname, '..\\..\\identeefi-frontend-react\\src\\components\\pages\\ScannerPage.jsx'),
    path.resolve(__dirname, '..\\..\\identeefi-frontend-react\\src\\components\\pages\\Product.jsx'),
    path.resolve(__dirname, '..\\..\\identeefi-frontend-react\\src\\components\\pages\\AddProduct.jsx')  // Added AddProduct.jsx
  ];

  files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let fileContent = fs.readFileSync(filePath, 'utf-8');

      // Replace or add the contract address in the file
      const regexAddr = /const\s+CONTRACT_ADDRESS\s*=\s*'.*?';/; // Regex to match the existing address definition
      if (regexAddr.test(fileContent)) {
        // Replace the existing address with the new address
        fileContent = fileContent.replace(regexAddr, `const CONTRACT_ADDRESS = '${contractAddress}';`);
      } else {
        // If CONTRACT_ADDRESS doesn't exist, add it after the imports
        fileContent = fileContent.replace(/import\s+.*?;/, `import { ethers } from "ethers";\n\nconst CONTRACT_ADDRESS = '${contractAddress}';`);
      }

      // Write the updated content back to the file
      fs.writeFileSync(filePath, fileContent, 'utf-8');
      console.log(`Updated contract address in file: ${filePath}`);
    }
  });
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
