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
    
    // Reverse Resolution: Mapping from user address to their primary domain name
    mapping(address => string) public primaryDomain;

    // Registration cost is 0.0001 native token (e.g. BTC on Matsnet) by default
    uint256 public registrationFee = 0.0001 ether; 

    // Events
    event DomainRegistered(string indexed domainName, address indexed owner, uint256 indexed tokenId);
    event PrimaryDomainSet(address indexed owner, string domainName);
    
    constructor() ERC721("Mezo Domains", "MZD") {
        _transferOwnership(msg.sender);
    }
    
    /**
     * @dev Internal function to handle the actual registration and minting
     */
    function _register(string memory _domainName, address _to) internal {
        require(bytes(_domainName).length > 0, "Domain name cannot be empty");
        require(domainToTokenId[_domainName] == 0, "Domain already registered");
        require(_to != address(0), "Cannot register to zero address");
        
        uint256 currentTokenId = ++nextTokenId;
        
        domainToTokenId[_domainName] = currentTokenId;
        tokenIdToDomain[currentTokenId] = _domainName;
        
        _safeMint(_to, currentTokenId);

        // Auto-set as primary domain if they don't have one yet
        if (bytes(primaryDomain[_to]).length == 0) {
            primaryDomain[_to] = _domainName;
            emit PrimaryDomainSet(_to, _domainName);
        }
        
        emit DomainRegistered(_domainName, _to, currentTokenId);
    }

    /**
     * @dev Set the primary domain for an address. Must own the domain.
     * @param _domainName The domain name to set as primary
     */
    function setPrimaryDomain(string memory _domainName) public {
        uint256 tokenId = domainToTokenId[_domainName];
        require(tokenId != 0, "Domain not registered");
        require(ownerOf(tokenId) == msg.sender, "You do not own this domain");
        
        primaryDomain[msg.sender] = _domainName;
        emit PrimaryDomainSet(msg.sender, _domainName);
    }

    /**
     * @dev Get the primary domain for a specific address
     * @param _owner The address to check
     * @return The primary domain name string
     */
    function getPrimaryDomain(address _owner) public view returns (string memory) {
        return primaryDomain[_owner];
    }

    /**
     * @dev Register a new domain name for a specific address (Only Owner)
     * @param _domainName The string domain name to register (e.g. "alice.poor")
     * @param _to The address that will own the domain
     */
    function registerDomainFor(string memory _domainName, address _to) public onlyOwner {
        _register(_domainName, _to);
    }
    
    /**
     * @dev Register a new domain name
     * @param _domainName The string domain name to register (e.g. "alice.poor")
     */
    function registerDomain(string memory _domainName) public payable {
        require(msg.value >= registrationFee, "Insufficient fee provided");
        _register(_domainName, msg.sender);
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
