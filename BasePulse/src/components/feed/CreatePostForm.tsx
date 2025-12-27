"use client";

import { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { PenSquare, Image, Loader2, Send, X } from "lucide-react";
import { useCreatePost } from "@/hooks/useContracts";
import { uploadToIPFS, createPostContent } from "@/lib/ipfs";
import { clsx } from "clsx";

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { address } = useAppKitAccount();
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { createPost, isPending, isConfirming, isSuccess } = useCreatePost();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || !address) return;
    
    try {
      setError(null);
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
      setError("Failed to create post. Please try again.");
      setIsUploading(false);
    }
  };
  
  // Reset form on success
  if (isSuccess) {
    setText("");
    setIsExpanded(false);
    onSuccess?.();
  }
  
  const isSubmitting = isUploading || isPending || isConfirming;
  const canSubmit = text.trim().length > 0 && !isSubmitting;
  
  return (
    <form onSubmit={handleSubmit} className="glass-card p-4">
      {/* Collapsed State */}
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-pulse-dark/50 hover:bg-pulse-dark transition-colors text-left"
        >
          <div className="avatar-gradient flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-pulse-dark flex items-center justify-center">
              <span className="text-sm font-bold text-gradient">
                {address?.slice(2, 4).toUpperCase()}
              </span>
            </div>
          </div>
          <span className="text-gray-400 flex-1">What's on your mind?</span>
          <PenSquare className="w-5 h-5 text-pulse-primary" />
        </button>
      ) : (
        /* Expanded State */
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="avatar-gradient">
                <div className="w-10 h-10 rounded-full bg-pulse-dark flex items-center justify-center">
                  <span className="text-sm font-bold text-gradient">
                    {address?.slice(2, 4).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-mono text-sm">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
                <p className="text-xs text-gray-500">Creating a post</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-pulse-dark/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts with the Base community..."
            className="textarea-field min-h-[120px]"
            maxLength={1000}
            disabled={isSubmitting}
            autoFocus
          />
          
          {/* Character count */}
          <div className="flex items-center justify-between">
            <span className={clsx(
              "text-xs",
              text.length > 900 ? "text-pulse-warning" : "text-gray-500"
            )}>
              {text.length}/1000
            </span>
            
            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-2 hover:bg-pulse-dark/50 rounded-lg transition-colors text-gray-400 hover:text-pulse-primary"
                disabled={isSubmitting}
              >
                <Image className="w-5 h-5" />
              </button>
              
              <button
                type="submit"
                disabled={!canSubmit}
                className={clsx(
                  "btn-primary flex items-center gap-2 text-sm px-4 py-2",
                  !canSubmit && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isUploading ? "Uploading..." : isPending ? "Confirming..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <p className="text-sm text-pulse-error">{error}</p>
          )}
          
          {/* Info */}
          <p className="text-xs text-gray-500">
            Your post will be stored on IPFS and registered on Base blockchain.
          </p>
        </div>
      )}
    </form>
  );
}

