const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ethereum Blockchain Configuration
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// Smart Contract Configuration
const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "category", "type": "string" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "photoUrl", "type": "string" },
      { "internalType": "address", "name": "addedBy", "type": "address" }
    ],
    "name": "addProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "productId", "type": "uint256" }],
    "name": "getProduct",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "category", "type": "string" },
          { "internalType": "uint256", "name": "price", "type": "uint256" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string", "name": "photoUrl", "type": "string" },
          { "internalType": "address", "name": "addedBy", "type": "address" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct ProductRegistry.Product",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// API Endpoints

// 1. Add Product
app.post('/api/addProduct', async (req, res) => {
  const { productName, category, price, description, photoUrl, walletAddress } = req.body;

  try {
    // Interact with the smart contract
    const tx = await contract.addProduct(productName, category, price, description, photoUrl, walletAddress);
    const receipt = await tx.wait();

    res.json({
      status: 'success',
      txHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add product to the blockchain.' });
  }
});

// 2. Get Product
app.get('/api/getProduct', async (req, res) => {
  const { productId } = req.query;

  try {
    const product = await contract.getProduct(productId);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch product details.' });
  }
});

// 3. Verify Product (Optional)
app.post('/api/verifyProduct', async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await contract.getProduct(productId);

    if (product) {
      res.json({ status: 'verified', product });
    } else {
      res.status(404).json({ status: 'not-found', message: 'Product not found in blockchain.' });
    }
  } catch (error) {
    console.error('Error verifying product:', error);
    res.status(500).json({ status: 'error', message: 'Failed to verify product.' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Blockchain server running at http://localhost:${port}`);
});
