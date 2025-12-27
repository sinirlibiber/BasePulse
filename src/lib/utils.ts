import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format timestamp to relative time
 */
export function formatDistanceToNow(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

/**
 * Format address for display
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format ETH value
 */
export function formatETH(value: bigint | number, decimals: number = 4): string {
  const num = typeof value === "bigint" ? Number(value) / 1e18 : value;
  return num.toFixed(decimals);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate Farcaster share URL
 */
export function getFarcasterShareUrl(text: string, url?: string): string {
  const baseUrl = "https://warpcast.com/~/compose";
  const params = new URLSearchParams();
  
  let shareText = text;
  if (url) {
    shareText += `\n\n${url}`;
  }
  
  params.set("text", shareText);
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate Twitter/X share URL
 */
export function getTwitterShareUrl(text: string, url?: string): string {
  const baseUrl = "https://twitter.com/intent/tweet";
  const params = new URLSearchParams();
  
  params.set("text", text);
  if (url) {
    params.set("url", url);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Check if running in Farcaster mini app context
 */
export function isFarcasterMiniApp(): boolean {
  if (typeof window === "undefined") return false;
  
  // Check for Farcaster frame context
  return window.location !== window.parent.location || 
         window.self !== window.top;
}

/**
 * Check if running in Base App mini app context
 */
export function isBaseAppMiniApp(): boolean {
  if (typeof window === "undefined") return false;
  
  // Check for Base App context (user agent or specific params)
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("coinbase") || userAgent.includes("base");
}

