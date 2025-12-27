"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Header } from "@/components/layout/Header";
import { useCreatePost, useHasProfile } from "@/hooks/useContracts";
import { uploadToIPFS, createPostContent } from "@/lib/ipfs";
import { 
  PenSquare, 
  Loader2, 
  ArrowLeft, 
  Image,
  Send,
  Check,
  AlertCircle,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function CreatePostPage() {
  const router = useRouter();
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  
  const { data: hasProfile, isLoading: isCheckingProfile } = useHasProfile(address as `0x${string}`);
  const { createPost, isPending, isConfirming, isSuccess, error, hash } = useCreatePost();
  
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Redirect on success
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push("/feed");
      }, 2000);
    }
  }, [isSuccess, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || !address) return;
    
    try {
      setUploadError(null);
      setIsUploading(true);
      
      // Create post content
      const content = createPostContent({
        text: text.trim(),
        images: [],
      });
      
      // Upload to IPFS
      const ipfsHash = await uploadToIPFS(content);
      
      setIsUploading(false);
      
      // Create on-chain post
      createPost(`ipfs://${ipfsHash}`);
      
    } catch (err) {
      console.error("Failed to create post:", err);
      setUploadError("Failed to upload post. Please try again.");
      setIsUploading(false);
    }
  };
  
  const isSubmitting = isUploading || isPending || isConfirming;
  const canSubmit = text.trim().length > 0 && !isSubmitting;
  
  // Not connected
  if (!isConnected) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-pulse-gradient mx-auto mb-6 flex items-center justify-center glow">
              <PenSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-4">
              Connect to Create Post
            </h1>
            <p className="text-gray-400 mb-8">
              Connect your wallet to share your thoughts with the community.
            </p>
            <button onClick={() => open()} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        </div>
      </main>
    );
  }
  
  // Checking profile
  if (isCheckingProfile) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin text-pulse-primary mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </main>
    );
  }
  
  // No profile - prompt to create one
  if (!hasProfile) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-pulse-card mx-auto mb-6 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-pulse-accent" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-4">
              Create Your Profile First
            </h1>
            <p className="text-gray-400 mb-8">
              You need a BasePulse profile to create posts. Mint your soulbound profile NFT to get started.
            </p>
            <Link href="/profile/create" className="btn-primary">
              Create Profile
            </Link>
          </div>
        </div>
      </main>
    );
  }
  
  // Success state
  if (isSuccess) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-pulse-success/20 mx-auto mb-6 flex items-center justify-center">
              <Check className="w-10 h-10 text-pulse-success" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-4">
              Post Created!
            </h1>
            <p className="text-gray-400 mb-4">
              Your post has been published on Base blockchain.
            </p>
            {hash && (
              <a
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-pulse-primary hover:underline mb-8 block"
              >
                View transaction ↗
              </a>
            )}
            <Link href="/feed" className="btn-primary">
              View Feed
            </Link>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen pb-20">
      <Header />
      
      <div className="pt-20 px-4">
        <div className="max-w-lg mx-auto">
          {/* Back button */}
          <Link 
            href="/feed" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Link>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display mb-2">
              Create Post
            </h1>
            <p className="text-gray-400">
              Share your thoughts with the Base community
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
            {/* Author info */}
            <div className="flex items-center gap-3 pb-4 border-b border-pulse-border/30">
              <div className="avatar-gradient p-0.5">
                <div className="w-12 h-12 rounded-full bg-pulse-dark flex items-center justify-center">
                  <span className="text-sm font-bold text-gradient">
                    {address?.slice(2, 4).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-mono text-sm">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
                <p className="text-xs text-gray-500">Posting to BasePulse</p>
              </div>
            </div>
            
            {/* Text input */}
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's happening in the Base ecosystem?"
                className="textarea-field min-h-[200px] text-lg"
                maxLength={1000}
                disabled={isSubmitting}
                autoFocus
              />
              <div className="flex items-center justify-between mt-2">
                <span className={clsx(
                  "text-xs",
                  text.length > 900 ? "text-pulse-warning" : "text-gray-500"
                )}>
                  {text.length}/1000
                </span>
              </div>
            </div>
            
            {/* Media upload (placeholder) */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="p-3 rounded-xl bg-pulse-dark/50 hover:bg-pulse-dark transition-colors text-gray-400 hover:text-pulse-primary"
                disabled={isSubmitting}
              >
                <Image className="w-5 h-5" />
              </button>
              <span className="text-xs text-gray-500">
                Image upload coming soon
              </span>
            </div>
            
            {/* Error messages */}
            {(uploadError || error) && (
              <div className="flex items-center gap-2 p-3 bg-pulse-error/10 border border-pulse-error/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-pulse-error flex-shrink-0" />
                <p className="text-sm text-pulse-error">
                  {uploadError || error?.message || "Something went wrong"}
                </p>
              </div>
            )}
            
            {/* Info */}
            <div className="p-4 bg-pulse-dark/50 rounded-xl">
              <p className="text-xs text-gray-400">
                Your post will be stored on IPFS and registered on Base blockchain. 
                Content is permanent and cannot be deleted.
              </p>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={clsx(
                "w-full btn-primary flex items-center justify-center gap-2",
                !canSubmit && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isUploading 
                    ? "Uploading to IPFS..." 
                    : isPending 
                    ? "Confirm in wallet..." 
                    : "Publishing..."}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Post
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

