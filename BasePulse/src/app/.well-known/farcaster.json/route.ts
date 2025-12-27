import { NextResponse } from "next/server";

/**
 * Farcaster Mini App Manifest
 * 
 * This endpoint serves the Farcaster app manifest required for
 * registering BasePulse as a Farcaster Mini App.
 * 
 * Reference: https://docs.farcaster.xyz/developers/frames/v2/spec
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET() {
  const manifest = {
    // App metadata
    name: "BasePulse",
    description: "On-Chain Social for Base - Create, engage, and earn",
    version: "1.0.0",
    
    // Frame configuration
    frame: {
      version: "vNext",
      homeUrl: `${APP_URL}/api/frame`,
      iconUrl: `${APP_URL}/logo.png`,
      splashBackgroundColor: "#0F0F23",
      name: "BasePulse",
    },
    
    // Allowed origins for frame interactions
    allowedOrigins: [
      APP_URL,
      "https://warpcast.com",
      "https://www.warpcast.com",
    ],
    
    // Triggers and actions
    triggers: [
      {
        type: "cast_action",
        name: "Share on BasePulse",
        description: "Share this cast on BasePulse",
        aboutUrl: `${APP_URL}/about`,
        action: {
          type: "post",
          postUrl: `${APP_URL}/api/frame/action/share`,
        },
      },
    ],
    
    // Developer information
    author: {
      name: "BasePulse Team",
      url: APP_URL,
    },
    
    // Categories
    categories: ["social", "defi", "nft"],
    
    // Supported chains
    chains: ["eip155:8453", "eip155:84532"], // Base Mainnet and Sepolia
    
    // External integrations
    external: {
      walletconnect: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      },
    },
  };
  
  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

