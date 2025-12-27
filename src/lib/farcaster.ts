/**
 * Farcaster Integration Utilities for BasePulse
 * 
 * Provides helpers for Farcaster Frame interactions and user data.
 */

const FARCASTER_HUB_URL = process.env.NEXT_PUBLIC_FARCASTER_HUB_URL || "https://hub.pinata.cloud";

/**
 * Farcaster user data type
 */
export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  verifications?: string[];
}

/**
 * Frame action data from Farcaster client
 */
export interface FrameActionData {
  fid: number;
  buttonIndex: number;
  inputText?: string;
  castId?: {
    fid: number;
    hash: string;
  };
  url: string;
  messageHash: string;
  timestamp: number;
  network: number;
  transactionId?: string;
}

/**
 * Validate a Frame message signature
 * In production, this should verify the message signature with a Farcaster hub
 */
export async function validateFrameMessage(
  trustedData: { messageBytes: string }
): Promise<boolean> {
  // TODO: Implement proper signature verification with Farcaster hub
  // For now, we trust the data (suitable for development)
  return true;
}

/**
 * Fetch Farcaster user data by FID
 */
export async function getFarcasterUser(fid: number): Promise<FarcasterUser | null> {
  try {
    // This is a simplified implementation
    // In production, use the Farcaster Hub API or Neynar
    const response = await fetch(
      `${FARCASTER_HUB_URL}/v1/userDataByFid?fid=${fid}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return {
      fid,
      username: data.username,
      displayName: data.displayName,
      pfpUrl: data.pfp,
      bio: data.bio,
    };
  } catch (error) {
    console.error("Failed to fetch Farcaster user:", error);
    return null;
  }
}

/**
 * Get Farcaster verifications (linked addresses) by FID
 */
export async function getFarcasterVerifications(fid: number): Promise<string[]> {
  try {
    const response = await fetch(
      `${FARCASTER_HUB_URL}/v1/verificationsByFid?fid=${fid}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.messages?.map((m: any) => m.data?.verificationAddAddressBody?.address) || [];
  } catch (error) {
    console.error("Failed to fetch verifications:", error);
    return [];
  }
}

/**
 * Generate a Warpcast composer URL to share BasePulse content
 */
export function generateWarpcastShareUrl(params: {
  text: string;
  embedUrl?: string;
  channelKey?: string;
}): string {
  const baseUrl = "https://warpcast.com/~/compose";
  const searchParams = new URLSearchParams();
  
  searchParams.set("text", params.text);
  
  if (params.embedUrl) {
    searchParams.set("embeds[]", params.embedUrl);
  }
  
  if (params.channelKey) {
    searchParams.set("channelKey", params.channelKey);
  }
  
  return `${baseUrl}?${searchParams.toString()}`;
}

/**
 * Generate share text for a BasePulse post
 */
export function generatePostShareText(params: {
  postId: string | number;
  authorName?: string;
  preview?: string;
}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://basepulse.xyz";
  
  let text = "Check out this post on BasePulse! 🔥\n\n";
  
  if (params.preview) {
    text += `"${params.preview.slice(0, 100)}${params.preview.length > 100 ? '...' : ''}"\n\n`;
  }
  
  if (params.authorName) {
    text += `By ${params.authorName}\n\n`;
  }
  
  text += `${appUrl}/post/${params.postId}`;
  
  return text;
}

/**
 * Check if the current context is a Farcaster Frame
 */
export function isInFarcasterFrame(): boolean {
  if (typeof window === "undefined") return false;
  
  // Check if we're in an iframe (Frame context)
  try {
    return window.self !== window.top;
  } catch {
    // If we get a SecurityError, we're likely in a cross-origin iframe
    return true;
  }
}

/**
 * Send a message to the parent Farcaster client
 * Used for Frame-to-client communication
 */
export function postFrameMessage(data: Record<string, any>): void {
  if (typeof window === "undefined") return;
  
  try {
    window.parent.postMessage(
      {
        type: "frame",
        ...data,
      },
      "*"
    );
  } catch (error) {
    console.error("Failed to post frame message:", error);
  }
}

/**
 * Frame SDK context type
 */
export interface FrameContext {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  client?: {
    clientFid: number;
    added: boolean;
  };
}

/**
 * Initialize Frame SDK (Frames v2)
 * This would integrate with @farcaster/frame-sdk when available
 */
export async function initFrameSDK(): Promise<FrameContext | null> {
  // Placeholder for Frame SDK v2 integration
  // In production, use: import sdk from '@farcaster/frame-sdk'
  
  if (!isInFarcasterFrame()) {
    return null;
  }
  
  // Return mock context for development
  return {
    user: undefined,
    client: undefined,
  };
}

