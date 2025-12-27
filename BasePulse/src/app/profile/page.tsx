"use client";

import { useEffect, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { 
  useHasProfile, 
  useProfileId, 
  useProfileURI, 
  useUserPosts, 
  useUserStats,
  usePost 
} from "@/hooks/useContracts";
import { fetchFromIPFS } from "@/lib/ipfs";
import { type ProfileMetadata } from "@/lib/contracts";
import { formatETH } from "@/lib/utils";
import { 
  User, 
  Settings, 
  Coins, 
  Heart, 
  FileText, 
  ExternalLink,
  Loader2,
  ArrowRight,
  Copy,
  Check
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  
  const { data: hasProfile, isLoading: isCheckingProfile } = useHasProfile(address as `0x${string}`);
  const { data: profileId } = useProfileId(address as `0x${string}`);
  const { data: profileURI } = useProfileURI(profileId);
  const { data: userPosts } = useUserPosts(address as `0x${string}`);
  const { data: userStats } = useUserStats(address as `0x${string}`);
  
  const [profile, setProfile] = useState<ProfileMetadata | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Fetch profile metadata from IPFS
  useEffect(() => {
    const loadProfile = async () => {
      if (!profileURI) return;
      
      try {
        setIsLoadingProfile(true);
        const data = await fetchFromIPFS<ProfileMetadata>(profileURI);
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    loadProfile();
  }, [profileURI]);
  
  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Not connected state
  if (!isConnected) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-pulse-card mx-auto mb-6 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-4">
              Connect to view your profile
            </h1>
            <p className="text-gray-400 mb-8">
              Connect your wallet to view and manage your BasePulse profile.
            </p>
            <button onClick={() => open()} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        </div>
      </main>
    );
  }
  
  // Loading state
  if (isCheckingProfile || isLoadingProfile) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin text-pulse-primary mx-auto mb-4" />
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }
  
  // No profile state
  if (!hasProfile) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-pulse-gradient mx-auto mb-6 flex items-center justify-center glow">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-4">
              Create Your Profile
            </h1>
            <p className="text-gray-400 mb-8">
              Mint your soulbound profile NFT to join the BasePulse community.
            </p>
            <Link href="/profile/create" className="btn-primary inline-flex items-center gap-2">
              Create Profile
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }
  
  // Profile exists - show profile
  return (
    <main className="min-h-screen pb-20">
      <Header />
      
      <div className="pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card p-6 mb-6">
            {/* Banner placeholder */}
            <div className="h-32 -mx-6 -mt-6 mb-4 bg-pulse-gradient rounded-t-2xl" />
            
            {/* Avatar and info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
              <div className="avatar-gradient p-1">
                <div className="w-24 h-24 rounded-full bg-pulse-dark flex items-center justify-center">
                  {profile?.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gradient">
                      {profile?.name?.slice(0, 2).toUpperCase() || address?.slice(2, 4).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold font-display">
                  {profile?.name || "Anonymous"}
                </h1>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mt-1"
                >
                  <span className="font-mono text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  {copied ? (
                    <Check className="w-4 h-4 text-pulse-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <Link 
                href="/profile/edit" 
                className="btn-secondary text-sm flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Edit
              </Link>
            </div>
            
            {/* Bio */}
            {profile?.bio && (
              <p className="text-gray-300 mt-4">{profile.bio}</p>
            )}
            
            {/* Links */}
            {profile?.links && Object.keys(profile.links).length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {profile.links.twitter && (
                  <a
                    href={`https://twitter.com/${profile.links.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge flex items-center gap-1"
                  >
                    Twitter
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.links.farcaster && (
                  <a
                    href={`https://warpcast.com/${profile.links.farcaster}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge flex items-center gap-1"
                  >
                    Farcaster
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.links.website && (
                  <a
                    href={profile.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge flex items-center gap-1"
                  >
                    Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-pulse-primary mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {userPosts?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Posts</div>
            </div>
            
            <div className="glass-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-pulse-accent mb-2">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {userStats ? Number(userStats[1]) : 0}
              </div>
              <div className="text-sm text-gray-400">Likes Received</div>
            </div>
            
            <div className="glass-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-pulse-success mb-2">
                <Coins className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">
                {userStats ? formatETH(userStats[2], 4) : "0.0000"}
              </div>
              <div className="text-sm text-gray-400">ETH Earned</div>
            </div>
          </div>
          
          {/* User Posts */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Your Posts</h2>
            {userPosts && userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((postId) => (
                  <UserPostCard key={postId.toString()} postId={postId} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No posts yet</p>
                <Link 
                  href="/create" 
                  className="btn-primary inline-flex items-center gap-2 mt-4"
                >
                  Create Your First Post
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// User post card component
function UserPostCard({ postId }: { postId: bigint }) {
  const { data: post, isLoading } = usePost(postId);
  
  if (isLoading || !post) {
    return (
      <div className="glass-card p-4 animate-pulse">
        <div className="w-full h-4 bg-pulse-border rounded mb-2" />
        <div className="w-3/4 h-4 bg-pulse-border rounded" />
      </div>
    );
  }
  
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">
          Post #{post.id.toString()}
        </span>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {Number(post.likeCount)}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-300 truncate">
        {post.contentURI}
      </p>
    </div>
  );
}

