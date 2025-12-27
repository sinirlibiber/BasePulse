import { NextRequest, NextResponse } from "next/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Farcaster Frame v2 - Main Frame Endpoint
 * 
 * This endpoint handles Frame interactions and returns appropriate Frame responses.
 * Farcaster clients (like Warpcast) will POST to this endpoint when users interact.
 */

// Frame state type
interface FrameState {
  page: "home" | "feed" | "profile" | "create" | "post";
  postId?: string;
}

// Parse frame state from URL
function parseState(stateParam: string | null): FrameState {
  if (!stateParam) return { page: "home" };
  try {
    return JSON.parse(Buffer.from(stateParam, "base64").toString("utf-8"));
  } catch {
    return { page: "home" };
  }
}

// Encode state for URL
function encodeState(state: FrameState): string {
  return Buffer.from(JSON.stringify(state)).toString("base64");
}

/**
 * GET - Initial Frame render
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stateParam = searchParams.get("state");
  const state = parseState(stateParam);
  
  // Generate frame HTML based on state
  const frameHtml = generateFrameHtml(state);
  
  return new NextResponse(frameHtml, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

/**
 * POST - Handle Frame interactions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract frame data
    const { untrustedData, trustedData } = body;
    const buttonIndex = untrustedData?.buttonIndex;
    const inputText = untrustedData?.inputText;
    const fid = untrustedData?.fid;
    const castId = untrustedData?.castId;
    
    // Get current state
    const stateParam = untrustedData?.state;
    const currentState = parseState(stateParam);
    
    // Handle button actions based on current page and button index
    const newState = handleButtonAction(currentState, buttonIndex, inputText);
    
    // Generate response frame
    const frameHtml = generateFrameHtml(newState, fid);
    
    return new NextResponse(frameHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Frame POST error:", error);
    
    // Return error frame
    return new NextResponse(generateErrorFrame(), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
}

/**
 * Handle button actions and return new state
 */
function handleButtonAction(
  currentState: FrameState,
  buttonIndex: number,
  inputText?: string
): FrameState {
  switch (currentState.page) {
    case "home":
      switch (buttonIndex) {
        case 1: return { page: "feed" };
        case 2: return { page: "profile" };
        case 3: return { page: "create" };
        default: return currentState;
      }
    
    case "feed":
      switch (buttonIndex) {
        case 1: return { page: "home" };
        case 2: return { page: "post", postId: "1" }; // View first post
        default: return currentState;
      }
    
    case "profile":
      switch (buttonIndex) {
        case 1: return { page: "home" };
        case 2: return { page: "create" };
        default: return currentState;
      }
    
    case "create":
      switch (buttonIndex) {
        case 1: return { page: "home" };
        default: return currentState;
      }
    
    case "post":
      switch (buttonIndex) {
        case 1: return { page: "feed" };
        default: return currentState;
      }
    
    default:
      return { page: "home" };
  }
}

/**
 * Generate Frame HTML based on state
 */
function generateFrameHtml(state: FrameState, fid?: number): string {
  const stateEncoded = encodeState(state);
  
  switch (state.page) {
    case "home":
      return generateHomeFrame(stateEncoded);
    case "feed":
      return generateFeedFrame(stateEncoded);
    case "profile":
      return generateProfileFrame(stateEncoded, fid);
    case "create":
      return generateCreateFrame(stateEncoded);
    case "post":
      return generatePostFrame(stateEncoded, state.postId);
    default:
      return generateHomeFrame(stateEncoded);
  }
}

/**
 * Home Frame
 */
function generateHomeFrame(state: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="fc:frame" content="vNext">
  <meta property="fc:frame:image" content="${APP_URL}/api/og?page=home">
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
  <meta property="fc:frame:state" content="${state}">
  
  <meta property="fc:frame:button:1" content="📰 View Feed">
  <meta property="fc:frame:button:1:action" content="post">
  
  <meta property="fc:frame:button:2" content="👤 My Profile">
  <meta property="fc:frame:button:2:action" content="post">
  
  <meta property="fc:frame:button:3" content="✍️ Create Post">
  <meta property="fc:frame:button:3:action" content="post">
  
  <meta property="fc:frame:button:4" content="🚀 Open App">
  <meta property="fc:frame:button:4:action" content="link">
  <meta property="fc:frame:button:4:target" content="${APP_URL}">
  
  <meta property="fc:frame:post_url" content="${APP_URL}/api/frame">
  
  <meta property="og:title" content="BasePulse | On-Chain Social for Base">
  <meta property="og:description" content="Create, engage, and earn on the decentralized social layer.">
  <meta property="og:image" content="${APP_URL}/api/og?page=home">
  
  <title>BasePulse</title>
</head>
<body>
  <h1>BasePulse</h1>
  <p>On-Chain Social for Base</p>
</body>
</html>`;
}

/**
 * Feed Frame
 */
function generateFeedFrame(state: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="fc:frame" content="vNext">
  <meta property="fc:frame:image" content="${APP_URL}/api/og?page=feed">
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
  <meta property="fc:frame:state" content="${state}">
  
  <meta property="fc:frame:button:1" content="⬅️ Back">
  <meta property="fc:frame:button:1:action" content="post">
  
  <meta property="fc:frame:button:2" content="👀 View Post">
  <meta property="fc:frame:button:2:action" content="post">
  
  <meta property="fc:frame:button:3" content="❤️ Like">
  <meta property="fc:frame:button:3:action" content="tx">
  <meta property="fc:frame:button:3:target" content="${APP_URL}/api/frame/tx/like">
  
  <meta property="fc:frame:button:4" content="📖 Open Feed">
  <meta property="fc:frame:button:4:action" content="link">
  <meta property="fc:frame:button:4:target" content="${APP_URL}/feed">
  
  <meta property="fc:frame:post_url" content="${APP_URL}/api/frame">
  
  <title>BasePulse Feed</title>
</head>
<body>
  <h1>BasePulse Feed</h1>
</body>
</html>`;
}

/**
 * Profile Frame
 */
function generateProfileFrame(state: string, fid?: number): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="fc:frame" content="vNext">
  <meta property="fc:frame:image" content="${APP_URL}/api/og?page=profile&fid=${fid || ''}">
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
  <meta property="fc:frame:state" content="${state}">
  
  <meta property="fc:frame:button:1" content="⬅️ Back">
  <meta property="fc:frame:button:1:action" content="post">
  
  <meta property="fc:frame:button:2" content="✍️ Create Post">
  <meta property="fc:frame:button:2:action" content="post">
  
  <meta property="fc:frame:button:3" content="🔗 Link Wallet">
  <meta property="fc:frame:button:3:action" content="tx">
  <meta property="fc:frame:button:3:target" content="${APP_URL}/api/frame/tx/link-farcaster">
  
  <meta property="fc:frame:button:4" content="👤 Open Profile">
  <meta property="fc:frame:button:4:action" content="link">
  <meta property="fc:frame:button:4:target" content="${APP_URL}/profile">
  
  <meta property="fc:frame:post_url" content="${APP_URL}/api/frame">
  
  <title>BasePulse Profile</title>
</head>
<body>
  <h1>Your BasePulse Profile</h1>
</body>
</html>`;
}

/**
 * Create Post Frame
 */
function generateCreateFrame(state: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="fc:frame" content="vNext">
  <meta property="fc:frame:image" content="${APP_URL}/api/og?page=create">
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
  <meta property="fc:frame:state" content="${state}">
  
  <meta property="fc:frame:input:text" content="What's on your mind?">
  
  <meta property="fc:frame:button:1" content="⬅️ Back">
  <meta property="fc:frame:button:1:action" content="post">
  
  <meta property="fc:frame:button:2" content="📝 Create Post">
  <meta property="fc:frame:button:2:action" content="tx">
  <meta property="fc:frame:button:2:target" content="${APP_URL}/api/frame/tx/create-post">
  
  <meta property="fc:frame:button:3" content="🚀 Open App">
  <meta property="fc:frame:button:3:action" content="link">
  <meta property="fc:frame:button:3:target" content="${APP_URL}/create">
  
  <meta property="fc:frame:post_url" content="${APP_URL}/api/frame">
  
  <title>Create Post on BasePulse</title>
</head>
<body>
  <h1>Create a Post</h1>
</body>
</html>`;
}

/**
 * Single Post Frame
 */
function generatePostFrame(state: string, postId?: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="fc:frame" content="vNext">
  <meta property="fc:frame:image" content="${APP_URL}/api/og?page=post&id=${postId || '1'}">
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
  <meta property="fc:frame:state" content="${state}">
  
  <meta property="fc:frame:button:1" content="⬅️ Back to Feed">
  <meta property="fc:frame:button:1:action" content="post">
  
  <meta property="fc:frame:button:2" content="❤️ Like (0.0001 ETH)">
  <meta property="fc:frame:button:2:action" content="tx">
  <meta property="fc:frame:button:2:target" content="${APP_URL}/api/frame/tx/paid-like?postId=${postId || '1'}">
  
  <meta property="fc:frame:button:3" content="🔄 Repost">
  <meta property="fc:frame:button:3:action" content="tx">
  <meta property="fc:frame:button:3:target" content="${APP_URL}/api/frame/tx/repost?postId=${postId || '1'}">
  
  <meta property="fc:frame:button:4" content="🔗 Share">
  <meta property="fc:frame:button:4:action" content="link">
  <meta property="fc:frame:button:4:target" content="${APP_URL}/post/${postId || '1'}">
  
  <meta property="fc:frame:post_url" content="${APP_URL}/api/frame">
  
  <title>BasePulse Post</title>
</head>
<body>
  <h1>Post #${postId || '1'}</h1>
</body>
</html>`;
}

/**
 * Error Frame
 */
function generateErrorFrame(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="fc:frame" content="vNext">
  <meta property="fc:frame:image" content="${APP_URL}/api/og?page=error">
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1">
  
  <meta property="fc:frame:button:1" content="🔄 Try Again">
  <meta property="fc:frame:button:1:action" content="post">
  
  <meta property="fc:frame:button:2" content="🏠 Home">
  <meta property="fc:frame:button:2:action" content="link">
  <meta property="fc:frame:button:2:target" content="${APP_URL}">
  
  <meta property="fc:frame:post_url" content="${APP_URL}/api/frame">
  
  <title>Error - BasePulse</title>
</head>
<body>
  <h1>Something went wrong</h1>
</body>
</html>`;
}

