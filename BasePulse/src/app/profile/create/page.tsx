"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Header } from "@/components/layout/Header";
import { useCreateProfile, useHasProfile } from "@/hooks/useContracts";
import { uploadToIPFS, createProfileMetadata } from "@/lib/ipfs";
import { 
  User, 
  Loader2, 
  ArrowLeft, 
  Sparkles,
  Check,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function CreateProfilePage() {
  const router = useRouter();
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  
  const { data: hasProfile, isLoading: isCheckingProfile } = useHasProfile(address as `0x${string}`);
  const { createProfile, isPending, isConfirming, isSuccess, error } = useCreateProfile();
  
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [farcaster, setFarcaster] = useState("");
  const [website, setWebsite] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Redirect if already has profile
  useEffect(() => {
    if (hasProfile) {
      router.push("/profile");
    }
  }, [hasProfile, router]);
  
  // Redirect on success
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    }
  }, [isSuccess, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !address) return;
    
    try {
      setUploadError(null);
      setIsUploading(true);
      
      // Create profile metadata
      const metadata = createProfileMetadata({
        name: name.trim(),
        bio: bio.trim(),
        links: {
          twitter: twitter.trim() || undefined,
          farcaster: farcaster.trim() || undefined,
          website: website.trim() || undefined,
        },
      });
      
      // Upload to IPFS
      const ipfsHash = await uploadToIPFS(metadata);
      
      setIsUploading(false);
      
      // Create on-chain profile
      createProfile(`ipfs://${ipfsHash}`);
      
    } catch (err) {
      console.error("Failed to create profile:", err);
      setUploadError("Failed to upload profile. Please try again.");
      setIsUploading(false);
    }
  };
  
  const isSubmitting = isUploading || isPending || isConfirming;
  const canSubmit = name.trim().length >= 2 && !isSubmitting;
  
  // Not connected
  if (!isConnected) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-pulse-gradient mx-auto mb-6 flex items-center justify-center glow">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-4">
              Connect to Create Profile
            </h1>
            <p className="text-gray-400 mb-8">
              Connect your wallet to mint your soulbound profile NFT.
            </p>
            <button onClick={() => open()} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        </div>
      </main>
    );
  }
  
  // Checking if has profile
  if (isCheckingProfile) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin text-pulse-primary mx-auto mb-4" />
            <p className="text-gray-400">Checking profile status...</p>
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
              Profile Created!
            </h1>
            <p className="text-gray-400 mb-8">
              Your soulbound profile NFT has been minted successfully.
            </p>
            <Link href="/profile" className="btn-primary">
              View Profile
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
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-pulse-gradient mx-auto mb-4 flex items-center justify-center glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">
              Create Your Profile
            </h1>
            <p className="text-gray-400">
              Mint your soulbound profile NFT to join BasePulse
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Display Name <span className="text-pulse-accent">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="input-field"
                maxLength={50}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                2-50 characters
              </p>
            </div>
            
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="textarea-field min-h-[100px]"
                maxLength={500}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {bio.length}/500 characters
              </p>
            </div>
            
            {/* Social Links */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Social Links <span className="text-gray-500">(optional)</span>
              </label>
              
              <div className="grid gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Twitter</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">@</span>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="username"
                      className="input-field flex-1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Farcaster</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">@</span>
                    <input
                      type="text"
                      value={farcaster}
                      onChange={(e) => setFarcaster(e.target.value)}
                      placeholder="username"
                      className="input-field flex-1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yoursite.com"
                    className="input-field"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
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
                <strong className="text-gray-300">Note:</strong> Your profile is a soulbound NFT 
                that cannot be transferred. It represents your unique identity on BasePulse 
                and will be stored permanently on the Base blockchain.
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
                    : "Creating profile..."}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Mint Profile NFT
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

