import { base, baseSepolia } from "wagmi/chains";

// ============================================
// Contract Addresses Configuration
// ============================================

const chainEnv = process.env.NEXT_PUBLIC_CHAIN_ENV || "baseSepolia";

// Contract addresses - update these after deployment
export const CONTRACT_ADDRESSES = {
  baseSepolia: {
    profileNFT: process.env.NEXT_PUBLIC_PROFILE_NFT_ADDRESS || "0x0000000000000000000000000000000000000000",
    postRegistry: process.env.NEXT_PUBLIC_POST_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000",
    engagementRewards: process.env.NEXT_PUBLIC_ENGAGEMENT_REWARDS_ADDRESS || "0x0000000000000000000000000000000000000000",
  },
  baseMainnet: {
    profileNFT: process.env.NEXT_PUBLIC_PROFILE_NFT_ADDRESS || "0x0000000000000000000000000000000000000000",
    postRegistry: process.env.NEXT_PUBLIC_POST_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000",
    engagementRewards: process.env.NEXT_PUBLIC_ENGAGEMENT_REWARDS_ADDRESS || "0x0000000000000000000000000000000000000000",
  },
};

// Get active addresses based on environment
export const getContractAddresses = () => {
  return CONTRACT_ADDRESSES[chainEnv as keyof typeof CONTRACT_ADDRESSES] || CONTRACT_ADDRESSES.baseSepolia;
};

// Get active chain
export const getActiveChain = () => {
  return chainEnv === "baseMainnet" ? base : baseSepolia;
};

// ============================================
// Contract ABIs
// ============================================

export const PROFILE_NFT_ABI = [
  // Read functions
  {
    inputs: [{ name: "wallet", type: "address" }],
    name: "hasProfile",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "wallet", type: "address" }],
    name: "profileOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "wallet", type: "address" }],
    name: "getProfileId",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "wallet", type: "address" }],
    name: "checkHasProfile",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalProfiles",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "fid", type: "uint256" }],
    name: "getAddressByFid",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "farcasterFid",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [{ name: "metadataURI", type: "string" }],
    name: "createProfile",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "newMetadataURI", type: "string" }],
    name: "updateProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "fid", type: "uint256" }],
    name: "linkFarcaster",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "metadataURI", type: "string" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "ProfileCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "newMetadataURI", type: "string" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "ProfileUpdated",
    type: "event",
  },
] as const;

export const POST_REGISTRY_ABI = [
  // Read functions
  {
    inputs: [{ name: "postId", type: "uint256" }],
    name: "getPost",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "author", type: "address" },
          { name: "contentURI", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "likeCount", type: "uint256" },
          { name: "commentCount", type: "uint256" },
          { name: "repostCount", type: "uint256" },
          { name: "exists", type: "bool" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "postId", type: "uint256" }],
    name: "getPostAuthor",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserPosts",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "postId", type: "uint256" }],
    name: "getPostComments",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "commentId", type: "uint256" }],
    name: "getComment",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "postId", type: "uint256" },
          { name: "author", type: "address" },
          { name: "contentURI", type: "string" },
          { name: "timestamp", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "postId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    name: "checkHasLiked",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPosts",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "count", type: "uint256" }],
    name: "getLatestPosts",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [{ name: "contentURI", type: "string" }],
    name: "createPost",
    outputs: [{ name: "postId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "postId", type: "uint256" }],
    name: "likePost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "postId", type: "uint256" }],
    name: "unlikePost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "postId", type: "uint256" },
      { name: "contentURI", type: "string" },
    ],
    name: "addComment",
    outputs: [{ name: "commentId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "postId", type: "uint256" }],
    name: "repost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "postId", type: "uint256" },
      { indexed: true, name: "author", type: "address" },
      { indexed: false, name: "contentURI", type: "string" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "PostCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "postId", type: "uint256" },
      { indexed: true, name: "liker", type: "address" },
      { indexed: true, name: "author", type: "address" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "PostLiked",
    type: "event",
  },
] as const;

export const ENGAGEMENT_REWARDS_ABI = [
  // Read functions
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserEarnings",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserStats",
    outputs: [
      { name: "given", type: "uint256" },
      { name: "received", type: "uint256" },
      { name: "earnings", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformStats",
    outputs: [
      { name: "fees", type: "uint256" },
      { name: "creatorRewards", type: "uint256" },
      { name: "likerRewards", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "calculateFeeDistribution",
    outputs: [
      { name: "creatorShare", type: "uint256" },
      { name: "treasuryShare", type: "uint256" },
      { name: "likerShare", type: "uint256" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "minLikeFee",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [{ name: "postId", type: "uint256" }],
    name: "paidLike",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "postIds", type: "uint256[]" }],
    name: "batchPaidLike",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "postId", type: "uint256" },
      { indexed: true, name: "liker", type: "address" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "totalFee", type: "uint256" },
      { indexed: false, name: "creatorReward", type: "uint256" },
      { indexed: false, name: "likerReward", type: "uint256" },
      { indexed: false, name: "treasuryFee", type: "uint256" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "PaidLike",
    type: "event",
  },
] as const;

// ============================================
// Helper Types
// ============================================

export interface Post {
  id: bigint;
  author: `0x${string}`;
  contentURI: string;
  timestamp: bigint;
  likeCount: bigint;
  commentCount: bigint;
  repostCount: bigint;
  exists: boolean;
}

export interface Comment {
  id: bigint;
  postId: bigint;
  author: `0x${string}`;
  contentURI: string;
  timestamp: bigint;
}

export interface PostContent {
  text: string;
  images?: string[];
  timestamp: number;
  // Future: Creator Token metadata
  // creatorToken?: string;
}

export interface ProfileMetadata {
  name: string;
  bio: string;
  avatar?: string;
  banner?: string;
  links?: {
    twitter?: string;
    farcaster?: string;
    website?: string;
  };
  // Future: Creator Token integration
  // creatorToken?: {
  //   address: string;
  //   symbol: string;
  // };
}

