// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Interface for PostRegistry
interface IPostRegistry {
    function getPostAuthor(uint256 postId) external view returns (address);
    function checkHasLiked(uint256 postId, address user) external view returns (bool);
    function recordPaidLike(uint256 postId, address liker) external;
}

/**
 * @title EngagementRewards
 * @author BasePulse Team
 * @notice Like-to-earn mechanism with native ETH micro-fees on Base
 * @dev Fee distribution: 70% creator, 20% treasury, 10% liker
 * 
 * Future Extensions:
 * - Creator Token rewards: Distribute social tokens instead of/alongside ETH
 * - Tiered rewards: Higher rewards for verified profiles
 * - Boost multipliers: Stake-based reward multipliers
 * - Comment rewards: Extend to comments and reposts
 */
contract EngagementRewards is Ownable, ReentrancyGuard {
    
    // ============ Constants ============
    
    /// @notice Percentage for content creator (70%)
    uint256 public constant CREATOR_SHARE = 70;
    
    /// @notice Percentage for platform treasury (20%)
    uint256 public constant TREASURY_SHARE = 20;
    
    /// @notice Percentage for liker (10%)
    uint256 public constant LIKER_SHARE = 10;
    
    /// @notice Percentage denominator
    uint256 public constant PERCENTAGE_BASE = 100;
    
    // ============ State Variables ============
    
    /// @notice PostRegistry contract
    IPostRegistry public postRegistry;
    
    /// @notice Treasury address for platform fees
    address public treasury;
    
    /// @notice Minimum fee for a paid like
    uint256 public minLikeFee;
    
    /// @notice Total fees collected
    uint256 public totalFeesCollected;
    
    /// @notice Total rewards distributed to creators
    uint256 public totalCreatorRewards;
    
    /// @notice Total rewards distributed to likers
    uint256 public totalLikerRewards;
    
    /// @notice Mapping of user earnings
    mapping(address => uint256) public userEarnings;
    
    /// @notice Mapping of user likes given (for stats)
    mapping(address => uint256) public likesGiven;
    
    /// @notice Mapping of user likes received (for stats)
    mapping(address => uint256) public likesReceived;
    
    // ============ Events ============
    
    /// @notice Emitted when a paid like is processed
    event PaidLike(
        uint256 indexed postId,
        address indexed liker,
        address indexed creator,
        uint256 totalFee,
        uint256 creatorReward,
        uint256 likerReward,
        uint256 treasuryFee,
        uint256 timestamp
    );
    
    /// @notice Emitted when treasury address is updated
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    
    /// @notice Emitted when minimum like fee is updated
    event MinLikeFeeUpdated(uint256 oldFee, uint256 newFee);
    
    /// @notice Emitted when funds are withdrawn
    event FundsWithdrawn(address indexed to, uint256 amount);
    
    // ============ Errors ============
    
    error InsufficientFee();
    error AlreadyLiked();
    error CannotLikeOwnPost();
    error TransferFailed();
    error InvalidAddress();
    error NoEarnings();
    
    // ============ Constructor ============
    
    /**
     * @param _postRegistry PostRegistry contract address
     * @param _treasury Treasury address for platform fees
     * @param _minLikeFee Minimum fee in wei for a paid like
     */
    constructor(
        address _postRegistry,
        address _treasury,
        uint256 _minLikeFee
    ) Ownable(msg.sender) {
        if (_postRegistry == address(0) || _treasury == address(0)) {
            revert InvalidAddress();
        }
        
        postRegistry = IPostRegistry(_postRegistry);
        treasury = _treasury;
        minLikeFee = _minLikeFee;
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Like a post with ETH payment
     * @param postId ID of the post to like
     * 
     * @dev Fee distribution:
     * - 70% goes to content creator
     * - 20% goes to platform treasury
     * - 10% goes back to liker (incentive)
     * 
     * Future: This could also distribute Creator Tokens
     */
    function paidLike(uint256 postId) external payable nonReentrant {
        // Validate fee
        if (msg.value < minLikeFee) revert InsufficientFee();
        
        // Check if already liked
        if (postRegistry.checkHasLiked(postId, msg.sender)) revert AlreadyLiked();
        
        // Get post author
        address creator = postRegistry.getPostAuthor(postId);
        
        // Cannot like own post
        if (creator == msg.sender) revert CannotLikeOwnPost();
        
        // Calculate fee distribution
        uint256 creatorReward = (msg.value * CREATOR_SHARE) / PERCENTAGE_BASE;
        uint256 treasuryFee = (msg.value * TREASURY_SHARE) / PERCENTAGE_BASE;
        uint256 likerReward = (msg.value * LIKER_SHARE) / PERCENTAGE_BASE;
        
        // Handle rounding - any remainder goes to creator
        uint256 remainder = msg.value - creatorReward - treasuryFee - likerReward;
        creatorReward += remainder;
        
        // Update stats
        totalFeesCollected += msg.value;
        totalCreatorRewards += creatorReward;
        totalLikerRewards += likerReward;
        
        userEarnings[creator] += creatorReward;
        userEarnings[msg.sender] += likerReward;
        likesGiven[msg.sender]++;
        likesReceived[creator]++;
        
        // Record like in PostRegistry
        postRegistry.recordPaidLike(postId, msg.sender);
        
        // Distribute rewards
        // Creator gets their share
        (bool creatorSuccess, ) = payable(creator).call{value: creatorReward}("");
        if (!creatorSuccess) revert TransferFailed();
        
        // Treasury gets platform fee
        (bool treasurySuccess, ) = payable(treasury).call{value: treasuryFee}("");
        if (!treasurySuccess) revert TransferFailed();
        
        // Liker gets their reward back
        (bool likerSuccess, ) = payable(msg.sender).call{value: likerReward}("");
        if (!likerSuccess) revert TransferFailed();
        
        emit PaidLike(
            postId,
            msg.sender,
            creator,
            msg.value,
            creatorReward,
            likerReward,
            treasuryFee,
            block.timestamp
        );
    }
    
    /**
     * @notice Batch like multiple posts
     * @param postIds Array of post IDs to like
     * 
     * @dev Each post requires minLikeFee
     */
    function batchPaidLike(uint256[] calldata postIds) external payable nonReentrant {
        uint256 totalRequired = minLikeFee * postIds.length;
        if (msg.value < totalRequired) revert InsufficientFee();
        
        uint256 feePerPost = msg.value / postIds.length;
        
        for (uint256 i = 0; i < postIds.length; i++) {
            _processPaidLike(postIds[i], feePerPost);
        }
    }
    
    // ============ Internal Functions ============
    
    function _processPaidLike(uint256 postId, uint256 fee) internal {
        // Skip if already liked
        if (postRegistry.checkHasLiked(postId, msg.sender)) return;
        
        address creator = postRegistry.getPostAuthor(postId);
        
        // Skip own posts
        if (creator == msg.sender) return;
        
        // Calculate fee distribution
        uint256 creatorReward = (fee * CREATOR_SHARE) / PERCENTAGE_BASE;
        uint256 treasuryFee = (fee * TREASURY_SHARE) / PERCENTAGE_BASE;
        uint256 likerReward = (fee * LIKER_SHARE) / PERCENTAGE_BASE;
        
        uint256 remainder = fee - creatorReward - treasuryFee - likerReward;
        creatorReward += remainder;
        
        // Update stats
        totalFeesCollected += fee;
        totalCreatorRewards += creatorReward;
        totalLikerRewards += likerReward;
        
        userEarnings[creator] += creatorReward;
        userEarnings[msg.sender] += likerReward;
        likesGiven[msg.sender]++;
        likesReceived[creator]++;
        
        // Record like
        postRegistry.recordPaidLike(postId, msg.sender);
        
        // Distribute rewards
        payable(creator).call{value: creatorReward}("");
        payable(treasury).call{value: treasuryFee}("");
        payable(msg.sender).call{value: likerReward}("");
        
        emit PaidLike(
            postId,
            msg.sender,
            creator,
            fee,
            creatorReward,
            likerReward,
            treasuryFee,
            block.timestamp
        );
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get user's total earnings
     * @param user Address to query
     * @return earnings Total ETH earned
     */
    function getUserEarnings(address user) external view returns (uint256) {
        return userEarnings[user];
    }
    
    /**
     * @notice Get user engagement stats
     * @param user Address to query
     * @return given Number of likes given
     * @return received Number of likes received
     * @return earnings Total ETH earned
     */
    function getUserStats(address user) 
        external 
        view 
        returns (uint256 given, uint256 received, uint256 earnings) 
    {
        return (likesGiven[user], likesReceived[user], userEarnings[user]);
    }
    
    /**
     * @notice Get platform stats
     * @return fees Total fees collected
     * @return creatorRewards Total creator rewards
     * @return likerRewards Total liker rewards
     */
    function getPlatformStats() 
        external 
        view 
        returns (uint256 fees, uint256 creatorRewards, uint256 likerRewards) 
    {
        return (totalFeesCollected, totalCreatorRewards, totalLikerRewards);
    }
    
    /**
     * @notice Calculate fee distribution for a given amount
     * @param amount Total fee amount
     * @return creatorShare Creator's share
     * @return treasuryShare Treasury's share
     * @return likerShare Liker's share
     */
    function calculateFeeDistribution(uint256 amount) 
        external 
        pure 
        returns (uint256 creatorShare, uint256 treasuryShare, uint256 likerShare) 
    {
        creatorShare = (amount * CREATOR_SHARE) / PERCENTAGE_BASE;
        treasuryShare = (amount * TREASURY_SHARE) / PERCENTAGE_BASE;
        likerShare = (amount * LIKER_SHARE) / PERCENTAGE_BASE;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Update treasury address
     * @param _treasury New treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        if (_treasury == address(0)) revert InvalidAddress();
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }
    
    /**
     * @notice Update minimum like fee
     * @param _minLikeFee New minimum fee in wei
     */
    function setMinLikeFee(uint256 _minLikeFee) external onlyOwner {
        emit MinLikeFeeUpdated(minLikeFee, _minLikeFee);
        minLikeFee = _minLikeFee;
    }
    
    /**
     * @notice Update PostRegistry contract
     * @param _postRegistry New PostRegistry address
     */
    function setPostRegistry(address _postRegistry) external onlyOwner {
        if (_postRegistry == address(0)) revert InvalidAddress();
        postRegistry = IPostRegistry(_postRegistry);
    }
    
    /**
     * @notice Emergency withdraw (only stuck funds)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoEarnings();
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert TransferFailed();
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}

