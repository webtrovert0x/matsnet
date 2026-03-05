// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MezoDomains is ERC721, Ownable {
    uint256 public nextTokenId;
    
    // Mapping from domain name (string) to token ID
    mapping(string => uint256) public domainToTokenId;
    // Mapping from token ID to domain name
    mapping(uint256 => string) public tokenIdToDomain;
    
    // Registration cost is 0.0001 native token (e.g. BTC on Matsnet) by default
    uint256 public registrationFee = 0.0001 ether; 

    // Events
    event DomainRegistered(string indexed domainName, address indexed owner, uint256 indexed tokenId);
    
    constructor() ERC721("Mezo Domains", "MZD") {
        _transferOwnership(msg.sender);
    }
    
    /**
     * @dev Register a new domain name
     * @param _domainName The string domain name to register (e.g. "alice.poor")
     */
    function registerDomain(string memory _domainName) public payable {
        require(bytes(_domainName).length > 0, "Domain name cannot be empty");
        require(domainToTokenId[_domainName] == 0, "Domain already registered");
        // For simplicity, we assume token ID 0 is never used or we ensure domains map uniquely
        // Wait, actually domainToTokenId[domain] will be 0 if not registered. Let's make the first token ID start at 1.
        
        require(msg.value >= registrationFee, "Insufficient fee provided");
        
        uint256 currentTokenId = ++nextTokenId;
        
        domainToTokenId[_domainName] = currentTokenId;
        tokenIdToDomain[currentTokenId] = _domainName;
        
        _safeMint(msg.sender, currentTokenId);
        
        emit DomainRegistered(_domainName, msg.sender, currentTokenId);
    }
    
    /**
     * @dev Returns the owner of a domain name
     * @param _domainName The domain name to query
     * @return The address of the owner
     */
    function getDomainOwner(string memory _domainName) public view returns (address) {
        uint256 tokenId = domainToTokenId[_domainName];
        require(tokenId != 0, "Domain not registered");
        return ownerOf(tokenId);
    }

    /**
     * @dev Sets a new registration fee
     * @param _newFee The new fee in wei
     */
    function setRegistrationFee(uint256 _newFee) external onlyOwner {
        registrationFee = _newFee;
    }
    
    /**
     * @dev Withdraw funds collected from domain registrations
     */
    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
