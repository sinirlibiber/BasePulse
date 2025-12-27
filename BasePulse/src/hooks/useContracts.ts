"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { 
  getContractAddresses, 
  PROFILE_NFT_ABI, 
  POST_REGISTRY_ABI, 
  ENGAGEMENT_REWARDS_ABI,
  type Post,
} from "@/lib/contracts";
import { getActiveChain } from "@/lib/contracts";

const addresses = getContractAddresses();
const chain = getActiveChain();

// ============================================
// Profile NFT Hooks
// ============================================

/**
 * Check if user has a profile
 */
export function useHasProfile(address: `0x${string}` | undefined) {
  return useReadContract({
    address: addresses.profileNFT as `0x${string}`,
    abi: PROFILE_NFT_ABI,
    functionName: "checkHasProfile",
    args: address ? [address] : undefined,
    chainId: chain.id,
    query: {
      enabled: !!address && addresses.profileNFT !== "0x0000000000000000000000000000000000000000",
    },
  });
}

/**
 * Get profile token ID for an address
 */
export function useProfileId(address: `0x${string}` | undefined) {
  return useReadContract({
    address: addresses.profileNFT as `0x${string}`,
    abi: PROFILE_NFT_ABI,
    functionName: "getProfileId",
    args: address ? [address] : undefined,
    chainId: chain.id,
    query: {
      enabled: !!address && addresses.profileNFT !== "0x0000000000000000000000000000000000000000",
    },
  });
}

/**
 * Get profile metadata URI
 */
export function useProfileURI(tokenId: bigint | undefined) {
  return useReadContract({
    address: addresses.profileNFT as `0x${string}`,
    abi: PROFILE_NFT_ABI,
    functionName: "tokenURI",
    args: tokenId ? [tokenId] : undefined,
    chainId: chain.id,
    query: {
      enabled: !!tokenId && tokenId > 0n,
    },
  });
}

/**
 * Get total number of profiles
 */
export function useTotalProfiles() {
  return useReadContract({
    address: addresses.profileNFT as `0x${string}`,
    abi: PROFILE_NFT_ABI,
    functionName: "totalProfiles",
    chainId: chain.id,
    query: {
      enabled: addresses.profileNFT !== "0x0000000000000000000000000000000000000000",
    },
  });
}

/**
 * Create profile hook
 */
export function useCreateProfile() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createProfile = (metadataURI: string) => {
    writeContract({
      address: addresses.profileNFT as `0x${string}`,
      abi: PROFILE_NFT_ABI,
      functionName: "createProfile",
      args: [metadataURI],
      chainId: chain.id,
    });
  };

  return {
    createProfile,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Update profile hook
 */
export function useUpdateProfile() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const updateProfile = (newMetadataURI: string) => {
    writeContract({
      address: addresses.profileNFT as `0x${string}`,
      abi: PROFILE_NFT_ABI,
      functionName: "updateProfile",
      args: [newMetadataURI],
      chainId: chain.id,
    });
  };

  return {
    updateProfile,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Link Farcaster FID hook
 */
export function useLinkFarcaster() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const linkFarcaster = (fid: bigint) => {
    writeContract({
      address: addresses.profileNFT as `0x${string}`,
      abi: PROFILE_NFT_ABI,
      functionName: "linkFarcaster",
      args: [fid],
      chainId: chain.id,
    });
  };

  return {
    linkFarcaster,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// ============================================
// Post Registry Hooks
// ============================================

/**
 * Get a specific post
 */
export function usePost(postId: bigint | undefined) {
  return useReadContract({
    address: addresses.postRegistry as `0x${string}`,
    abi: POST_REGISTRY_ABI,
    functionName: "getPost",
    args: postId ? [postId] : undefined,
    chainId: chain.id,
    query: {
      enabled: !!postId && postId > 0n,
    },
  });
}

/**
 * Get latest posts for feed
 */
export function useLatestPosts(count: number = 20) {
  return useReadContract({
    address: addresses.postRegistry as `0x${string}`,
    abi: POST_REGISTRY_ABI,
    functionName: "getLatestPosts",
    args: [BigInt(count)],
    chainId: chain.id,
    query: {
      enabled: addresses.postRegistry !== "0x0000000000000000000000000000000000000000",
    },
  });
}

/**
 * Get user's posts
 */
export function useUserPosts(address: `0x${string}` | undefined) {
  return useReadContract({
    address: addresses.postRegistry as `0x${string}`,
    abi: POST_REGISTRY_ABI,
    functionName: "getUserPosts",
    args: address ? [address] : undefined,
    chainId: chain.id,
    query: {
      enabled: !!address,
    },
  });
}

/**
 * Check if user has liked a post
 */
export function useHasLiked(postId: bigint | undefined, address: `0x${string}` | undefined) {
  return useReadContract({
    address: addresses.postRegistry as `0x${string}`,
    abi: POST_REGISTRY_ABI,
    functionName: "checkHasLiked",
    args: postId && address ? [postId, address] : undefined,
    chainId: chain.id,
    query: {
      enabled: !!postId && !!address,
    },
  });
}

/**
 * Get total number of posts
 */
export function useTotalPosts() {
  return useReadContract({
    address: addresses.postRegistry as `0x${string}`,
    abi: POST_REGISTRY_ABI,
    functionName: "totalPosts",
    chainId: chain.id,
    query: {
      enabled: addresses.postRegistry !== "0x0000000000000000000000000000000000000000",
    },
  });
}

/**
 * Create post hook
 */
export function useCreatePost() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createPost = (contentURI: string) => {
    writeContract({
      address: addresses.postRegistry as `0x${string}`,
      abi: POST_REGISTRY_ABI,
      functionName: "createPost",
      args: [contentURI],
      chainId: chain.id,
    });
  };

  return {
    createPost,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Like post (free) hook
 */
export function useLikePost() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const likePost = (postId: bigint) => {
    writeContract({
      address: addresses.postRegistry as `0x${string}`,
      abi: POST_REGISTRY_ABI,
      functionName: "likePost",
      args: [postId],
      chainId: chain.id,
    });
  };

  return {
    likePost,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Add comment hook
 */
export function useAddComment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const addComment = (postId: bigint, contentURI: string) => {
    writeContract({
      address: addresses.postRegistry as `0x${string}`,
      abi: POST_REGISTRY_ABI,
      functionName: "addComment",
      args: [postId, contentURI],
      chainId: chain.id,
    });
  };

  return {
    addComment,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Repost hook
 */
export function useRepost() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const repost = (postId: bigint) => {
    writeContract({
      address: addresses.postRegistry as `0x${string}`,
      abi: POST_REGISTRY_ABI,
      functionName: "repost",
      args: [postId],
      chainId: chain.id,
    });
  };

  return {
    repost,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

// ============================================
// Engagement Rewards Hooks
// ============================================

/**
 * Get minimum like fee
 */
export function useMinLikeFee() {
  return useReadContract({
    address: addresses.engagementRewards as `0x${string}`,
    abi: ENGAGEMENT_REWARDS_ABI,
    functionName: "minLikeFee",
    chainId: chain.id,
    query: {
      enabled: addresses.engagementRewards !== "0x0000000000000000000000000000000000000000",
    },
  });
}

/**
 * Get user stats (likes given, received, earnings)
 */
export function useUserStats(address: `0x${string}` | undefined) {
  return useReadContract({
    address: addresses.engagementRewards as `0x${string}`,
    abi: ENGAGEMENT_REWARDS_ABI,
    functionName: "getUserStats",
    args: address ? [address] : undefined,
    chainId: chain.id,
    query: {
      enabled: !!address && addresses.engagementRewards !== "0x0000000000000000000000000000000000000000",
    },
  });
}

/**
 * Get platform stats
 */
export function usePlatformStats() {
  return useReadContract({
    address: addresses.engagementRewards as `0x${string}`,
    abi: ENGAGEMENT_REWARDS_ABI,
    functionName: "getPlatformStats",
    chainId: chain.id,
    query: {
      enabled: addresses.engagementRewards !== "0x0000000000000000000000000000000000000000",
    },
  });
}

/**
 * Paid like hook (like-to-earn)
 */
export function usePaidLike() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const paidLike = (postId: bigint, fee: string = "0.0001") => {
    writeContract({
      address: addresses.engagementRewards as `0x${string}`,
      abi: ENGAGEMENT_REWARDS_ABI,
      functionName: "paidLike",
      args: [postId],
      value: parseEther(fee),
      chainId: chain.id,
    });
  };

  return {
    paidLike,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Batch paid like hook
 */
export function useBatchPaidLike() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const batchPaidLike = (postIds: bigint[], feePerPost: string = "0.0001") => {
    const totalFee = parseEther(feePerPost) * BigInt(postIds.length);
    
    writeContract({
      address: addresses.engagementRewards as `0x${string}`,
      abi: ENGAGEMENT_REWARDS_ABI,
      functionName: "batchPaidLike",
      args: [postIds],
      value: totalFee,
      chainId: chain.id,
    });
  };

  return {
    batchPaidLike,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

