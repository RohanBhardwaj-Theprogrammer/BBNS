// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Authentix {
    address public owner;

    struct ProductHistory {
        uint id;
        string actor;
        string location;
        string timestamp;
        bool isSold;
    }

    struct Product {
        string name;
        string serialNumber;
        string description;
        string brand;
        string image;
        uint historySize;
        mapping(uint => ProductHistory) history;
    }

    mapping(string => Product) private products; // Map serialNumber to Product

    constructor() {
        owner = msg.sender;
    }

    // Register a new product
    function registerProduct(
        string memory _name,
        string memory _brand,
        string memory _serialNumber,
        string memory _description,
        string memory _image,
        string memory _actor,
        string memory _location,
        string memory _timestamp
    ) public {
        require(bytes(products[_serialNumber].serialNumber).length == 0, "Product already exists");
        
        Product storage p = products[_serialNumber];

        p.name = _name;
        p.brand = _brand;
        p.serialNumber = _serialNumber;
        p.description = _description;
        p.image = _image;
        p.historySize = 0;

        addProductHistory(_serialNumber, _actor, _location, _timestamp, false);
    }

    // Add history to a product
    function addProductHistory(
        string memory _serialNumber,
        string memory _actor,
        string memory _location,
        string memory _timestamp,
        bool _isSold
    ) public {
        require(bytes(products[_serialNumber].serialNumber).length > 0, "Product does not exist");

        Product storage p = products[_serialNumber];
        p.historySize++;
        p.history[p.historySize] = ProductHistory(p.historySize, _actor, _location, _timestamp, _isSold);

        console.log("History Size: %s", p.historySize);
        console.log("Product History added by: %s", p.history[p.historySize].actor);
    }

    // Retrieve a product and its history
    function getProduct(string memory _serialNumber)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            ProductHistory[] memory
        )
    {
        require(bytes(products[_serialNumber].serialNumber).length > 0, "Product does not exist");

        Product storage p = products[_serialNumber];
        ProductHistory[] memory pHistory = new ProductHistory[](p.historySize);

        for (uint i = 0; i < p.historySize; i++) {
            ProductHistory storage history = p.history[i + 1];
            pHistory[i] = ProductHistory(history.id, history.actor, history.location, history.timestamp, history.isSold);
        }

        return (
            p.serialNumber,
            p.name,
            p.brand,
            p.description,
            p.image,
            pHistory
        );
    }
}
