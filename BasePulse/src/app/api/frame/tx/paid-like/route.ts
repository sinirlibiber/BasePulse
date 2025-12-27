import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, parseEther } from "viem";
import { ENGAGEMENT_REWARDS_ABI, getContractAddresses, getActiveChain } from "@/lib/contracts";

const addresses = getContractAddresses();
const chain = getActiveChain();

/**
 * Farcaster Frame Transaction - Paid Like
 * 
 * This endpoint returns transaction data for a paid like action.
 * The Frame client will prompt the user to sign this transaction.
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get("postId") || "1";
    
    // Encode the transaction data
    const data = encodeFunctionData({
      abi: ENGAGEMENT_REWARDS_ABI,
      functionName: "paidLike",
      args: [BigInt(postId)],
    });
    
    // Return transaction data in Frame format
    const txData = {
      chainId: `eip155:${chain.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: ENGAGEMENT_REWARDS_ABI,
        to: addresses.engagementRewards,
        data: data,
        value: parseEther("0.0001").toString(),
      },
    };
    
    return NextResponse.json(txData);
  } catch (error) {
    console.error("Paid like tx error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

/**
 * GET - Return transaction metadata
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    name: "Paid Like",
    description: "Like this post and support the creator (0.0001 ETH)",
    chain: chain.name,
    contractAddress: addresses.engagementRewards,
  });
}

