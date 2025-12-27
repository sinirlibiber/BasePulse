// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ProfileNFT
 * @author BasePulse Team
 * @notice Soulbound NFT representing user social identity on BasePulse
 * @dev ERC-721 non-transferable token - each wallet can mint only one profile
 * 
 * Future Extensions:
 * - Creator Token integration: Profiles can be linked to social tokens
 * - Reputation system: On-chain engagement metrics stored per profile
 * - Verified badges: Integration with Farcaster/ENS for verification
 */
contract ProfileNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    
    // ============ State Variables ============
    
    /// @notice Total number of profiles minted
    uint256 private _tokenIdCounter;
    
    /// @notice Mapping from wallet address to their profile token ID
    mapping(address => uint256) public profileOf;
    
    /// @notice Mapping to check if an address has a profile
    mapping(address => bool) public hasProfile;
    
    /// @notice Mapping from token ID to Farcaster FID (if linked)
    mapping(uint256 => uint256) public farcasterFid;
    
    /// @notice Mapping from Farcaster FID to wallet address
    mapping(uint256 => address) public fidToAddress;
    
    // ============ Events ============
    
    /// @notice Emitted when a new profile is created
    event ProfileCreated(
        address indexed owner,
        uint256 indexed tokenId,
        string metadataURI,
        uint256 timestamp
    );
    
    /// @notice Emitted when profile metadata is updated
    event ProfileUpdated(
        uint256 indexed tokenId,
        string newMetadataURI,
        uint256 timestamp
    );
    
    /// @notice Emitted when Farcaster FID is linked to profile
    event FarcasterLinked(
        uint256 indexed tokenId,
        uint256 indexed fid,
        address indexed wallet
    );
    
    // ============ Errors ============
    
    error AlreadyHasProfile();
    error ProfileDoesNotExist();
    error SoulboundTokenCannotBeTransferred();
    error InvalidMetadataURI();
    error FidAlreadyLinked();
    
    // ============ Constructor ============
    
    constructor() ERC721("BasePulse Profile", "BPPROFILE") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start from 1, 0 reserved for "no profile"
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Create a new profile NFT
     * @param metadataURI IPFS URI containing profile metadata (name, bio, avatar, etc.)
     * @return tokenId The ID of the newly minted profile NFT
     * 
     * @dev Each wallet can only have one profile (soulbound)
     * Metadata should be JSON with: name, bio, avatar, links, etc.
     */
    function createProfile(string calldata metadataURI) 
        external 
        nonReentrant 
        returns (uint256 tokenId) 
    {
        if (hasProfile[msg.sender]) revert AlreadyHasProfile();
        if (bytes(metadataURI).length == 0) revert InvalidMetadataURI();
        
        tokenId = _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        profileOf[msg.sender] = tokenId;
        hasProfile[msg.sender] = true;
        
        emit ProfileCreated(msg.sender, tokenId, metadataURI, block.timestamp);
    }
    
    /**
     * @notice Update profile metadata
     * @param newMetadataURI New IPFS URI for profile metadata
     */
    function updateProfile(string calldata newMetadataURI) external {
        if (!hasProfile[msg.sender]) revert ProfileDoesNotExist();
        if (bytes(newMetadataURI).length == 0) revert InvalidMetadataURI();
        
        uint256 tokenId = profileOf[msg.sender];
        _setTokenURI(tokenId, newMetadataURI);
        
        emit ProfileUpdated(tokenId, newMetadataURI, block.timestamp);
    }
    
    /**
     * @notice Link Farcaster FID to profile
     * @param fid Farcaster user ID
     * 
     * @dev In production, this should verify FID ownership
     * via Farcaster hub signature verification
     */
    function linkFarcaster(uint256 fid) external {
        if (!hasProfile[msg.sender]) revert ProfileDoesNotExist();
        if (fidToAddress[fid] != address(0)) revert FidAlreadyLinked();
        
        uint256 tokenId = profileOf[msg.sender];
        farcasterFid[tokenId] = fid;
        fidToAddress[fid] = msg.sender;
        
        emit FarcasterLinked(tokenId, fid, msg.sender);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get profile token ID for an address
     * @param wallet Address to query
     * @return tokenId Profile token ID (0 if no profile)
     */
    function getProfileId(address wallet) external view returns (uint256) {
        return profileOf[wallet];
    }
    
    /**
     * @notice Check if address has a profile
     * @param wallet Address to check
     * @return bool True if wallet has a profile
     */
    function checkHasProfile(address wallet) external view returns (bool) {
        return hasProfile[wallet];
    }
    
    /**
     * @notice Get wallet address by Farcaster FID
     * @param fid Farcaster user ID
     * @return wallet Associated wallet address
     */
    function getAddressByFid(uint256 fid) external view returns (address) {
        return fidToAddress[fid];
    }
    
    /**
     * @notice Get total number of profiles
     * @return count Total profiles created
     */
    function totalProfiles() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    // ============ Override Functions (Soulbound) ============
    
    /**
     * @dev Override to make token soulbound (non-transferable)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) but block transfers
        if (from != address(0) && to != address(0)) {
            revert SoulboundTokenCannotBeTransferred();
        }
        
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Block approval for soulbound tokens
     */
    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert SoulboundTokenCannotBeTransferred();
    }
    
    /**
     * @dev Block approval for all for soulbound tokens
     */
    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert SoulboundTokenCannotBeTransferred();
    }
    
    // ============ Required Overrides ============
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

