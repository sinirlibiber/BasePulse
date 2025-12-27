"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Repeat2, Share, Coins, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";
import { useHasLiked, usePaidLike, useLikePost, useMinLikeFee } from "@/hooks/useContracts";
import { fetchFromIPFS } from "@/lib/ipfs";
import { clsx } from "clsx";
import { formatEther } from "viem";

interface PostCardProps {
  post: {
    id: bigint;
    author: `0x${string}`;
    contentURI: string;
    timestamp: bigint;
    likeCount: bigint;
    commentCount: bigint;
    repostCount: bigint;
  };
  currentUser?: `0x${string}`;
}

interface PostContentData {
  text: string;
  images?: string[];
  timestamp: number;
}

export function PostCard({ post, currentUser }: PostCardProps) {
  const [content, setContent] = useState<PostContentData | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [showPaidLike, setShowPaidLike] = useState(false);
  
  const { data: hasLiked, refetch: refetchLiked } = useHasLiked(post.id, currentUser);
  const { data: minFee } = useMinLikeFee();
  const { paidLike, isPending: isPaidLikePending, isSuccess: isPaidLikeSuccess } = usePaidLike();
  const { likePost, isPending: isFreeLikePending, isSuccess: isFreeLikeSuccess } = useLikePost();
  
  // Fetch post content from IPFS
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoadingContent(true);
        // Handle mock hashes in development
        if (post.contentURI.startsWith("bafkreig") && post.contentURI.includes("mock")) {
          setContent({
            text: "This is a sample post content for development.",
            images: [],
            timestamp: Date.now(),
          });
        } else {
          const data = await fetchFromIPFS<PostContentData>(post.contentURI);
          setContent(data);
        }
      } catch (error) {
        console.error("Failed to load post content:", error);
        setContent({
          text: "[Content unavailable]",
          images: [],
          timestamp: Date.now(),
        });
      } finally {
        setIsLoadingContent(false);
      }
    };
    
    loadContent();
  }, [post.contentURI]);
  
  // Refetch liked status after successful like
  useEffect(() => {
    if (isPaidLikeSuccess || isFreeLikeSuccess) {
      refetchLiked();
    }
  }, [isPaidLikeSuccess, isFreeLikeSuccess, refetchLiked]);
  
  const handleLike = () => {
    if (!currentUser || hasLiked) return;
    likePost(post.id);
  };
  
  const handlePaidLike = () => {
    if (!currentUser || hasLiked) return;
    const fee = minFee ? formatEther(minFee) : "0.0001";
    paidLike(post.id, fee);
    setShowPaidLike(false);
  };
  
  const isLiking = isPaidLikePending || isFreeLikePending;
  const isOwnPost = currentUser?.toLowerCase() === post.author.toLowerCase();
  
  return (
    <article className="glass-card p-6 hover:border-pulse-primary/30 transition-colors duration-300">
      {/* Author Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="avatar-gradient">
          <div className="w-10 h-10 rounded-full bg-pulse-dark flex items-center justify-center">
            <span className="text-sm font-bold text-gradient">
              {post.author.slice(2, 4).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate font-mono text-sm">
            {post.author.slice(0, 6)}...{post.author.slice(-4)}
          </p>
          <p className="text-gray-500 text-xs">
            {formatDistanceToNow(Number(post.timestamp) * 1000)}
          </p>
        </div>
        <a
          href={`https://basescan.org/address/${post.author}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-pulse-primary transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      {/* Post Content */}
      <div className="mb-4">
        {isLoadingContent ? (
          <div className="space-y-2 animate-pulse">
            <div className="w-full h-4 bg-pulse-border rounded" />
            <div className="w-3/4 h-4 bg-pulse-border rounded" />
          </div>
        ) : (
          <>
            <p className="text-gray-100 whitespace-pre-wrap break-words">
              {content?.text}
            </p>
            {content?.images && content.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {content.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Post image ${i + 1}`}
                    className="rounded-xl object-cover w-full h-48"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-pulse-border/30">
        {/* Like Button */}
        <div className="relative">
          <button
            onClick={() => setShowPaidLike(!showPaidLike)}
            disabled={isLiking || hasLiked || isOwnPost || !currentUser}
            className={clsx(
              "flex items-center gap-2 text-sm transition-colors",
              hasLiked
                ? "text-pulse-accent"
                : "text-gray-400 hover:text-pulse-accent",
              (isLiking || isOwnPost || !currentUser) && "opacity-50 cursor-not-allowed"
            )}
          >
            <Heart
              className={clsx("w-5 h-5", hasLiked && "fill-pulse-accent")}
            />
            <span>{Number(post.likeCount)}</span>
          </button>
          
          {/* Paid Like Popup */}
          {showPaidLike && currentUser && !hasLiked && !isOwnPost && (
            <div className="absolute bottom-full left-0 mb-2 p-3 glass-card min-w-[200px] z-10">
              <p className="text-xs text-gray-400 mb-2">Support this creator</p>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="w-full btn-ghost text-sm mb-2 justify-start"
              >
                <Heart className="w-4 h-4 mr-2" />
                Free Like
              </button>
              <button
                onClick={handlePaidLike}
                disabled={isLiking}
                className="w-full btn-primary text-sm flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" />
                Paid Like ({minFee ? formatEther(minFee) : "0.0001"} ETH)
              </button>
              <p className="text-xs text-gray-500 mt-2">
                70% goes to creator, 10% back to you
              </p>
            </div>
          )}
        </div>
        
        {/* Comment Button */}
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-pulse-secondary transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>{Number(post.commentCount)}</span>
        </button>
        
        {/* Repost Button */}
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-pulse-success transition-colors">
          <Repeat2 className="w-5 h-5" />
          <span>{Number(post.repostCount)}</span>
        </button>
        
        {/* Share Button */}
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-pulse-primary transition-colors ml-auto">
          <Share className="w-5 h-5" />
        </button>
      </div>
    </article>
  );
}

