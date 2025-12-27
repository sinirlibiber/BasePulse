"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Zap, Users, Coins, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function Home() {
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pulse-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pulse-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pulse-accent/10 rounded-full blur-3xl" />
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pulse-card/50 border border-pulse-border/50 backdrop-blur-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-pulse-accent" />
            <span className="text-sm text-gray-300">Now live on Base</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 animate-slide-up">
            <span className="block text-white">The Social Layer</span>
            <span className="block text-gradient">Built on Base</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up stagger-1">
            Create your on-chain identity. Share your thoughts. 
            Earn from every engagement.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-2">
            {isConnected ? (
              <Link href="/feed" className="btn-primary inline-flex items-center gap-2">
                Enter BasePulse
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={() => open()}
                className="btn-primary inline-flex items-center gap-2"
              >
                Connect Wallet
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <Link href="/about" className="btn-secondary">
              Learn More
            </Link>
          </div>
          
          {/* Connected address display */}
          {isConnected && address && (
            <div className="mt-6 animate-fade-in">
              <span className="text-sm text-gray-500">Connected: </span>
              <span className="text-sm text-pulse-primary font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-4">
            Why BasePulse?
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            A new paradigm for social media where creators own their content 
            and earn directly from engagement.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 rounded-xl bg-pulse-primary/20 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-pulse-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Soulbound Identity</h3>
              <p className="text-gray-400">
                Your profile is a non-transferable NFT. True on-chain identity 
                that represents your social reputation.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 rounded-xl bg-pulse-secondary/20 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-pulse-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">On-Chain Posts</h3>
              <p className="text-gray-400">
                Every post is stored on IPFS and registered on Base. 
                Your content lives forever, uncensorable.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-14 h-14 rounded-xl bg-pulse-accent/20 flex items-center justify-center mb-6">
                <Coins className="w-7 h-7 text-pulse-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Like-to-Earn</h3>
              <p className="text-gray-400">
                Creators earn 70% of like fees. Likers get 10% back. 
                Real economic incentives for quality content.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 px-4 border-t border-pulse-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                Base
              </div>
              <div className="text-gray-400">Native Chain</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                70%
              </div>
              <div className="text-gray-400">Creator Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                IPFS
              </div>
              <div className="text-gray-400">Decentralized Storage</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                ∞
              </div>
              <div className="text-gray-400">Content Ownership</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pulse-primary/10 via-pulse-secondary/10 to-pulse-accent/10" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Ready to join the future of social?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Connect your wallet, create your on-chain profile, and start 
                earning from your content today.
              </p>
              {isConnected ? (
                <Link href="/profile/create" className="btn-primary inline-flex items-center gap-2">
                  Create Your Profile
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={() => open()}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 border-t border-pulse-border/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pulse-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">BasePulse</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/feed" className="hover:text-white transition-colors">Feed</Link>
            <a 
              href="https://base.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Built on Base
            </a>
            <a 
              href="https://warpcast.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Farcaster
            </a>
          </div>
          <div className="text-sm text-gray-500">
            © 2024 BasePulse. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

