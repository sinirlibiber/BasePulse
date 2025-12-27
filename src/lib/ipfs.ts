/**
 * IPFS Upload Utilities for BasePulse
 * 
 * Uses Pinata for IPFS pinning
 * Can be extended to support Web3.Storage or other providers
 */

const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/";

/**
 * Upload JSON data to IPFS via Pinata
 */
export async function uploadToIPFS(data: object): Promise<string> {
  const response = await fetch("/api/ipfs/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to upload to IPFS");
  }

  const result = await response.json();
  return result.ipfsHash;
}

/**
 * Upload file to IPFS via Pinata
 */
export async function uploadFileToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/ipfs/upload-file", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to IPFS");
  }

  const result = await response.json();
  return result.ipfsHash;
}

/**
 * Get IPFS gateway URL from hash
 */
export function getIPFSUrl(hash: string): string {
  // Remove ipfs:// prefix if present
  const cleanHash = hash.replace("ipfs://", "");
  return `${PINATA_GATEWAY}${cleanHash}`;
}

/**
 * Fetch JSON data from IPFS
 */
export async function fetchFromIPFS<T>(hash: string): Promise<T> {
  const url = getIPFSUrl(hash);
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch from IPFS");
  }
  
  return response.json();
}

/**
 * Create profile metadata for IPFS upload
 */
export function createProfileMetadata(params: {
  name: string;
  bio: string;
  avatar?: string;
  banner?: string;
  links?: {
    twitter?: string;
    farcaster?: string;
    website?: string;
  };
}) {
  return {
    name: params.name,
    bio: params.bio,
    avatar: params.avatar || "",
    banner: params.banner || "",
    links: params.links || {},
    createdAt: Date.now(),
    // Future: Creator Token metadata
    // creatorToken: null,
  };
}

/**
 * Create post content for IPFS upload
 */
export function createPostContent(params: {
  text: string;
  images?: string[];
}) {
  return {
    text: params.text,
    images: params.images || [],
    timestamp: Date.now(),
    version: "1.0.0",
    // Future: Creator Token tip data
    // tip: null,
  };
}

/**
 * Create comment content for IPFS upload
 */
export function createCommentContent(params: {
  text: string;
}) {
  return {
    text: params.text,
    timestamp: Date.now(),
    version: "1.0.0",
  };
}

