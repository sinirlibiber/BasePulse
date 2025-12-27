import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ipfs/upload
 * Upload JSON data to IPFS via Pinata
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const pinataJWT = process.env.PINATA_JWT;
    
    if (!pinataJWT) {
      // Development fallback - return mock hash
      console.warn("PINATA_JWT not set, using mock IPFS hash");
      const mockHash = `bafkreig${Date.now().toString(36)}mock`;
      return NextResponse.json({ ipfsHash: mockHash });
    }
    
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: `basepulse-${Date.now()}`,
        },
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("Pinata error:", error);
      return NextResponse.json(
        { error: "Failed to upload to IPFS" },
        { status: 500 }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json({
      ipfsHash: result.IpfsHash,
      pinSize: result.PinSize,
      timestamp: result.Timestamp,
    });
  } catch (error) {
    console.error("IPFS upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

