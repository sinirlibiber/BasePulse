"use client";

import { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/feed/PostCard";
import { CreatePostForm } from "@/components/feed/CreatePostForm";
import { useLatestPosts, usePost } from "@/hooks/useContracts";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";

export default function FeedPage() {
  const { isConnected, address } = useAppKitAccount();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data: postIds, isLoading, refetch } = useLatestPosts(20);
  
  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    refetch();
  };

  return (
    <main className="min-h-screen pb-20">
      <Header />
      
      <div className="pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold font-display flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-pulse-accent" />
                Feed
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Latest posts from the Base community
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="btn-ghost flex items-center gap-2"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
          
          {/* Create Post Form */}
          {isConnected && (
            <div className="mb-8">
              <CreatePostForm onSuccess={handleRefresh} />
            </div>
          )}
          
          {/* Posts List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-pulse-primary mb-4" />
                <p className="text-gray-400">Loading posts...</p>
              </div>
            ) : postIds && postIds.length > 0 ? (
              postIds.map((postId) => (
                <PostCardWrapper 
                  key={`${postId}-${refreshKey}`} 
                  postId={postId} 
                  currentUser={address}
                />
              ))
            ) : (
              <div className="glass-card p-12 text-center">
                <Sparkles className="w-12 h-12 text-pulse-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No posts yet</h3>
                <p className="text-gray-400 mb-6">
                  Be the first to share something with the community!
                </p>
                {!isConnected && (
                  <p className="text-sm text-gray-500">
                    Connect your wallet to create posts
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Wrapper component to fetch individual post data
 */
function PostCardWrapper({ 
  postId, 
  currentUser 
}: { 
  postId: bigint; 
  currentUser: `0x${string}` | undefined;
}) {
  const { data: post, isLoading, error } = usePost(postId);
  
  if (isLoading) {
    return <PostCardSkeleton />;
  }
  
  if (error || !post) {
    return null;
  }
  
  return (
    <PostCard 
      post={{
        id: post.id,
        author: post.author,
        contentURI: post.contentURI,
        timestamp: post.timestamp,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        repostCount: post.repostCount,
      }}
      currentUser={currentUser}
    />
  );
}

/**
 * Loading skeleton for post cards
 */
function PostCardSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-pulse-border" />
        <div className="flex-1">
          <div className="w-24 h-4 bg-pulse-border rounded mb-2" />
          <div className="w-16 h-3 bg-pulse-border rounded" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="w-full h-4 bg-pulse-border rounded" />
        <div className="w-3/4 h-4 bg-pulse-border rounded" />
      </div>
      <div className="flex gap-6">
        <div className="w-16 h-6 bg-pulse-border rounded" />
        <div className="w-16 h-6 bg-pulse-border rounded" />
        <div className="w-16 h-6 bg-pulse-border rounded" />
      </div>
    </div>
  );
}

