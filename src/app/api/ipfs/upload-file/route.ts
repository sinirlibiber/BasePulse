import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ipfs/upload-file
 * Upload a file (image, etc.) to IPFS via Pinata
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }
    
    const pinataJWT = process.env.PINATA_JWT;
    
    if (!pinataJWT) {
      // Development fallback - return mock hash
      console.warn("PINATA_JWT not set, using mock IPFS hash");
      const mockHash = `bafkreig${Date.now().toString(36)}filemock`;
      return NextResponse.json({ 
        ipfsHash: mockHash,
        url: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
      });
    }
    
    // Prepare form data for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append("file", file);
    pinataFormData.append("pinataMetadata", JSON.stringify({
      name: `basepulse-file-${Date.now()}`,
    }));
    
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: pinataFormData,
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
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
    
    return NextResponse.json({
      ipfsHash: result.IpfsHash,
      url: `${gateway}${result.IpfsHash}`,
      pinSize: result.PinSize,
      timestamp: result.Timestamp,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

