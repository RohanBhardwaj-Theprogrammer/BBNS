// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        string name;
        string category;
        uint256 price;
        string description;
        string photoUrl;
        address addedBy;
        uint256 timestamp;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    function addProduct(
        string memory name,
        string memory category,
        uint256 price,
        string memory description,
        string memory photoUrl,
        address addedBy
    ) public {
        productCount++;
        products[productCount] = Product(
            name,
            category,
            price,
            description,
            photoUrl,
            addedBy,
            block.timestamp
        );
    }

    function getProduct(uint256 productId) public view returns (Product memory) {
        return products[productId];
    }
}
