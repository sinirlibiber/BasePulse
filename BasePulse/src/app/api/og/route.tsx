import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Dynamic OG Image Generator for Farcaster Frames
 * 
 * Generates images for different Frame pages:
 * - home: Welcome/landing image
 * - feed: Feed preview
 * - profile: User profile
 * - create: Create post prompt
 * - post: Individual post
 * - error: Error state
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page") || "home";
  const postId = searchParams.get("id");
  const fid = searchParams.get("fid");
  
  // Common styles
  const baseStyles = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, sans-serif",
  };
  
  const gradientBg = {
    background: "linear-gradient(135deg, #0F0F23 0%, #070714 100%)",
  };
  
  // Generate image based on page type
  switch (page) {
    case "home":
      return new ImageResponse(
        (
          <div style={{ ...baseStyles, ...gradientBg }}>
            {/* Gradient orbs */}
            <div
              style={{
                position: "absolute",
                top: "20%",
                left: "20%",
                width: "300px",
                height: "300px",
                background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                right: "20%",
                width: "300px",
                height: "300px",
                background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
                borderRadius: "50%",
              }}
            />
            
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #F472B6 100%)",
                marginBottom: "24px",
              }}
            >
              <span style={{ fontSize: "40px" }}>⚡</span>
            </div>
            
            {/* Title */}
            <h1
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "white",
                margin: "0 0 16px 0",
                textAlign: "center",
              }}
            >
              BasePulse
            </h1>
            
            {/* Subtitle */}
            <p
              style={{
                fontSize: "28px",
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #F472B6 100%)",
                backgroundClip: "text",
                color: "transparent",
                margin: 0,
                textAlign: "center",
              }}
            >
              On-Chain Social for Base
            </p>
            
            {/* Features */}
            <div
              style={{
                display: "flex",
                gap: "40px",
                marginTop: "48px",
              }}
            >
              {["Soulbound Profiles", "Like-to-Earn", "Decentralized"].map((feature) => (
                <div
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#9CA3AF",
                    fontSize: "18px",
                  }}
                >
                  <span style={{ color: "#10B981" }}>✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    
    case "feed":
      return new ImageResponse(
        (
          <div style={{ ...baseStyles, ...gradientBg }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "60px", marginBottom: "24px" }}>📰</span>
              <h1
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: "white",
                  margin: "0 0 16px 0",
                }}
              >
                BasePulse Feed
              </h1>
              <p
                style={{
                  fontSize: "24px",
                  color: "#9CA3AF",
                  margin: 0,
                }}
              >
                Latest posts from the Base community
              </p>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    
    case "profile":
      return new ImageResponse(
        (
          <div style={{ ...baseStyles, ...gradientBg }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Avatar placeholder */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #F472B6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <span style={{ fontSize: "40px" }}>👤</span>
              </div>
              
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "white",
                  margin: "0 0 8px 0",
                }}
              >
                Your Profile
              </h1>
              
              {fid && (
                <p
                  style={{
                    fontSize: "20px",
                    color: "#6366F1",
                    margin: "0 0 16px 0",
                  }}
                >
                  Farcaster ID: {fid}
                </p>
              )}
              
              <p
                style={{
                  fontSize: "20px",
                  color: "#9CA3AF",
                  margin: 0,
                }}
              >
                View your posts, stats, and earnings
              </p>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    
    case "create":
      return new ImageResponse(
        (
          <div style={{ ...baseStyles, ...gradientBg }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "60px", marginBottom: "24px" }}>✍️</span>
              <h1
                style={{
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: "white",
                  margin: "0 0 16px 0",
                }}
              >
                Create a Post
              </h1>
              <p
                style={{
                  fontSize: "24px",
                  color: "#9CA3AF",
                  margin: 0,
                  textAlign: "center",
                  maxWidth: "600px",
                }}
              >
                Share your thoughts with the Base community. 
                Your content lives forever on-chain.
              </p>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    
    case "post":
      return new ImageResponse(
        (
          <div style={{ ...baseStyles, ...gradientBg }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px",
                maxWidth: "800px",
              }}
            >
              {/* Post card */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(26, 26, 46, 0.8)",
                  borderRadius: "24px",
                  padding: "32px",
                  border: "1px solid rgba(45, 45, 68, 0.5)",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
                      Post #{postId || "1"}
                    </span>
                    <span style={{ color: "#9CA3AF", fontSize: "14px" }}>
                      on BasePulse
                    </span>
                  </div>
                </div>
                
                <p
                  style={{
                    color: "#E5E7EB",
                    fontSize: "24px",
                    margin: "0 0 24px 0",
                    lineHeight: "1.5",
                  }}
                >
                  View this post on BasePulse and support the creator with a paid like!
                </p>
                
                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    color: "#9CA3AF",
                    fontSize: "16px",
                  }}
                >
                  <span>❤️ Like to Earn</span>
                  <span>💬 Comment</span>
                  <span>🔄 Repost</span>
                </div>
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    
    case "error":
      return new ImageResponse(
        (
          <div style={{ ...baseStyles, ...gradientBg }}>
            <span style={{ fontSize: "60px", marginBottom: "24px" }}>⚠️</span>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#EF4444",
                margin: "0 0 16px 0",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: "24px",
                color: "#9CA3AF",
                margin: 0,
              }}
            >
              Please try again or open the app
            </p>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    
    default:
      // Default to home
      return new ImageResponse(
        (
          <div style={{ ...baseStyles, ...gradientBg }}>
            <h1 style={{ fontSize: "56px", color: "white" }}>BasePulse</h1>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
  }
}

