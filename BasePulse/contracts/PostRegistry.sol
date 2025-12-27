// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PostRegistry
 * @author BasePulse Team
 * @notice On-chain registry for social posts with engagement tracking
 * @dev Posts are stored as IPFS hashes, engagement is tracked on-chain via events
 * 
 * Future Extensions:
 * - Creator Token tips: Allow tipping posts with social tokens
 * - Boosted posts: Paid promotion system
 * - Content moderation: DAO-controlled content flagging
 */
contract PostRegistry is Ownable, ReentrancyGuard {
    
    // ============ Structs ============
    
    struct Post {
        uint256 id;
        address author;
        string contentURI;      // IPFS hash
        uint256 timestamp;
        uint256 likeCount;
        uint256 commentCount;
        uint256 repostCount;
        bool exists;
    }
    
    struct Comment {
        uint256 id;
        uint256 postId;
        address author;
        string contentURI;      // IPFS hash
        uint256 timestamp;
    }
    
    // ============ State Variables ============
    
    /// @notice Profile NFT contract address
    address public profileNFT;
    
    /// @notice Counter for post IDs
    uint256 private _postIdCounter;
    
    /// @notice Counter for comment IDs
    uint256 private _commentIdCounter;
    
    /// @notice Mapping from post ID to Post data
    mapping(uint256 => Post) public posts;
    
    /// @notice Mapping from comment ID to Comment data
    mapping(uint256 => Comment) public comments;
    
    /// @notice Mapping from post ID to array of comment IDs
    mapping(uint256 => uint256[]) public postComments;
    
    /// @notice Mapping to track likes: postId => user => hasLiked
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    
    /// @notice Mapping to track reposts: postId => user => hasReposted
    mapping(uint256 => mapping(address => bool)) public hasReposted;
    
    /// @notice Mapping from user address to their post IDs
    mapping(address => uint256[]) public userPosts;
    
    // ============ Events ============
    
    /// @notice Emitted when a new post is created
    event PostCreated(
        uint256 indexed postId,
        address indexed author,
        string contentURI,
        uint256 timestamp
    );
    
    /// @notice Emitted when a post is liked
    event PostLiked(
        uint256 indexed postId,
        address indexed liker,
        address indexed author,
        uint256 timestamp
    );
    
    /// @notice Emitted when a post is unliked
    event PostUnliked(
        uint256 indexed postId,
        address indexed unliker,
        uint256 timestamp
    );
    
    /// @notice Emitted when a comment is added
    event CommentCreated(
        uint256 indexed commentId,
        uint256 indexed postId,
        address indexed author,
        string contentURI,
        uint256 timestamp
    );
    
    /// @notice Emitted when a post is reposted
    event PostReposted(
        uint256 indexed postId,
        address indexed reposter,
        address indexed originalAuthor,
        uint256 timestamp
    );
    
    // ============ Errors ============
    
    error PostDoesNotExist();
    error AlreadyLiked();
    error NotLiked();
    error AlreadyReposted();
    error EmptyContent();
    error Unauthorized();
    
    // ============ Constructor ============
    
    constructor(address _profileNFT) Ownable(msg.sender) {
        profileNFT = _profileNFT;
        _postIdCounter = 1;
        _commentIdCounter = 1;
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Create a new post
     * @param contentURI IPFS URI containing post content (text, images, etc.)
     * @return postId The ID of the newly created post
     * 
     * @dev Content should be JSON with: text, images[], timestamp
     */
    function createPost(string calldata contentURI) 
        external 
        nonReentrant 
        returns (uint256 postId) 
    {
        if (bytes(contentURI).length == 0) revert EmptyContent();
        
        postId = _postIdCounter++;
        
        posts[postId] = Post({
            id: postId,
            author: msg.sender,
            contentURI: contentURI,
            timestamp: block.timestamp,
            likeCount: 0,
            commentCount: 0,
            repostCount: 0,
            exists: true
        });
        
        userPosts[msg.sender].push(postId);
        
        emit PostCreated(postId, msg.sender, contentURI, block.timestamp);
    }
    
    /**
     * @notice Like a post (without reward - use EngagementRewards for paid likes)
     * @param postId ID of the post to like
     */
    function likePost(uint256 postId) external {
        Post storage post = posts[postId];
        if (!post.exists) revert PostDoesNotExist();
        if (hasLiked[postId][msg.sender]) revert AlreadyLiked();
        
        hasLiked[postId][msg.sender] = true;
        post.likeCount++;
        
        emit PostLiked(postId, msg.sender, post.author, block.timestamp);
    }
    
    /**
     * @notice Unlike a post
     * @param postId ID of the post to unlike
     */
    function unlikePost(uint256 postId) external {
        Post storage post = posts[postId];
        if (!post.exists) revert PostDoesNotExist();
        if (!hasLiked[postId][msg.sender]) revert NotLiked();
        
        hasLiked[postId][msg.sender] = false;
        post.likeCount--;
        
        emit PostUnliked(postId, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Add a comment to a post
     * @param postId ID of the post to comment on
     * @param contentURI IPFS URI containing comment content
     * @return commentId The ID of the new comment
     */
    function addComment(uint256 postId, string calldata contentURI) 
        external 
        nonReentrant 
        returns (uint256 commentId) 
    {
        Post storage post = posts[postId];
        if (!post.exists) revert PostDoesNotExist();
        if (bytes(contentURI).length == 0) revert EmptyContent();
        
        commentId = _commentIdCounter++;
        
        comments[commentId] = Comment({
            id: commentId,
            postId: postId,
            author: msg.sender,
            contentURI: contentURI,
            timestamp: block.timestamp
        });
        
        postComments[postId].push(commentId);
        post.commentCount++;
        
        emit CommentCreated(commentId, postId, msg.sender, contentURI, block.timestamp);
    }
    
    /**
     * @notice Repost a post
     * @param postId ID of the post to repost
     */
    function repost(uint256 postId) external {
        Post storage post = posts[postId];
        if (!post.exists) revert PostDoesNotExist();
        if (hasReposted[postId][msg.sender]) revert AlreadyReposted();
        
        hasReposted[postId][msg.sender] = true;
        post.repostCount++;
        
        emit PostReposted(postId, msg.sender, post.author, block.timestamp);
    }
    
    /**
     * @notice Record a like from EngagementRewards contract
     * @param postId ID of the post
     * @param liker Address of the liker
     * 
     * @dev Only callable by authorized contracts (EngagementRewards)
     */
    function recordPaidLike(uint256 postId, address liker) external {
        Post storage post = posts[postId];
        if (!post.exists) revert PostDoesNotExist();
        
        // In production, add access control here
        // require(msg.sender == engagementRewardsContract, "Unauthorized");
        
        if (!hasLiked[postId][liker]) {
            hasLiked[postId][liker] = true;
            post.likeCount++;
            
            emit PostLiked(postId, liker, post.author, block.timestamp);
        }
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get post details
     * @param postId ID of the post
     * @return Post struct with all details
     */
    function getPost(uint256 postId) external view returns (Post memory) {
        if (!posts[postId].exists) revert PostDoesNotExist();
        return posts[postId];
    }
    
    /**
     * @notice Get post author
     * @param postId ID of the post
     * @return author Address of the post author
     */
    function getPostAuthor(uint256 postId) external view returns (address) {
        if (!posts[postId].exists) revert PostDoesNotExist();
        return posts[postId].author;
    }
    
    /**
     * @notice Get all posts by a user
     * @param user Address of the user
     * @return postIds Array of post IDs
     */
    function getUserPosts(address user) external view returns (uint256[] memory) {
        return userPosts[user];
    }
    
    /**
     * @notice Get comments for a post
     * @param postId ID of the post
     * @return commentIds Array of comment IDs
     */
    function getPostComments(uint256 postId) external view returns (uint256[] memory) {
        return postComments[postId];
    }
    
    /**
     * @notice Get comment details
     * @param commentId ID of the comment
     * @return Comment struct with all details
     */
    function getComment(uint256 commentId) external view returns (Comment memory) {
        return comments[commentId];
    }
    
    /**
     * @notice Check if user has liked a post
     * @param postId ID of the post
     * @param user Address to check
     * @return bool True if user has liked the post
     */
    function checkHasLiked(uint256 postId, address user) external view returns (bool) {
        return hasLiked[postId][user];
    }
    
    /**
     * @notice Get total number of posts
     * @return count Total posts created
     */
    function totalPosts() external view returns (uint256) {
        return _postIdCounter - 1;
    }
    
    /**
     * @notice Get latest posts (for feed)
     * @param count Number of posts to return
     * @return postIds Array of latest post IDs (newest first)
     */
    function getLatestPosts(uint256 count) external view returns (uint256[] memory) {
        uint256 total = _postIdCounter - 1;
        if (count > total) count = total;
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = total - i;
        }
        return result;
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Update ProfileNFT contract address
     * @param _profileNFT New ProfileNFT contract address
     */
    function setProfileNFT(address _profileNFT) external onlyOwner {
        profileNFT = _profileNFT;
    }
}

