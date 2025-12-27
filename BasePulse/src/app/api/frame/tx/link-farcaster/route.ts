import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData } from "viem";
import { PROFILE_NFT_ABI, getContractAddresses, getActiveChain } from "@/lib/contracts";

const addresses = getContractAddresses();
const chain = getActiveChain();

/**
 * Farcaster Frame Transaction - Link Farcaster FID
 * 
 * This endpoint returns transaction data to link a Farcaster FID
 * to the user's BasePulse profile.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract FID from the frame request
    const fid = body?.untrustedData?.fid;
    
    if (!fid) {
      return NextResponse.json(
        { error: "No Farcaster ID found" },
        { status: 400 }
      );
    }
    
    // Encode the transaction data
    const data = encodeFunctionData({
      abi: PROFILE_NFT_ABI,
      functionName: "linkFarcaster",
      args: [BigInt(fid)],
    });
    
    // Return transaction data in Frame format
    const txData = {
      chainId: `eip155:${chain.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: PROFILE_NFT_ABI,
        to: addresses.profileNFT,
        data: data,
      },
    };
    
    return NextResponse.json(txData);
  } catch (error) {
    console.error("Link Farcaster tx error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

/**
 * GET - Return transaction metadata
 */
export async function GET() {
  return NextResponse.json({
    name: "Link Farcaster",
    description: "Link your Farcaster account to your BasePulse profile",
    chain: chain.name,
    contractAddress: addresses.profileNFT,
  });
}

