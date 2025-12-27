"use client";

import { Header } from "@/components/layout/Header";
import { 
  Zap, 
  Users, 
  Coins, 
  Shield, 
  Globe, 
  Code,
  ArrowRight,
  ExternalLink,
  Heart
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-20">
      <Header />
      
      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <section className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-pulse-gradient mb-6 glow">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              About BasePulse
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The first SocialFi platform native to Base blockchain. 
              Own your content, earn from engagement, build your on-chain reputation.
            </p>
          </section>
          
          {/* Mission */}
          <section className="glass-card p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold font-display mb-4">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              BasePulse reimagines social media for the Web3 era. We believe creators 
              should own their content and directly benefit from the engagement they generate. 
              By building on Base and integrating with Farcaster, we're creating a truly 
              decentralized social layer where your identity, content, and earnings are 
              permanently yours.
            </p>
          </section>
          
          {/* Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display mb-8 text-center">
              Core Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pulse-primary/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-pulse-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Soulbound Profiles</h3>
                </div>
                <p className="text-gray-400">
                  Your profile is a non-transferable NFT that represents your unique 
                  identity on BasePulse. It cannot be sold or stolen, ensuring authentic 
                  social interactions.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pulse-secondary/20 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-pulse-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">On-Chain Content</h3>
                </div>
                <p className="text-gray-400">
                  Every post is stored on IPFS and registered on the Base blockchain. 
                  Your content is permanent, uncensorable, and truly owned by you.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pulse-accent/20 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-pulse-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Like-to-Earn</h3>
                </div>
                <p className="text-gray-400">
                  Support creators with paid likes. 70% goes to the content creator, 
                  20% to the platform, and 10% back to you. Real economic incentives 
                  for quality content.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-pulse-success/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-pulse-success" />
                  </div>
                  <h3 className="text-xl font-bold">Farcaster Integration</h3>
                </div>
                <p className="text-gray-400">
                  Use BasePulse directly within Farcaster as a Mini App. Link your 
                  Farcaster identity to your BasePulse profile for a seamless 
                  cross-platform experience.
                </p>
              </div>
            </div>
          </section>
          
          {/* Tech Stack */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display mb-8 text-center">
              Technology Stack
            </h2>
            <div className="glass-card p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0052FF]/20 flex items-center justify-center mb-3">
                    <span className="text-2xl">🔵</span>
                  </div>
                  <h4 className="font-bold mb-1">Base</h4>
                  <p className="text-sm text-gray-400">L2 Blockchain</p>
                </div>
                <div>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/20 flex items-center justify-center mb-3">
                    <span className="text-2xl">🟣</span>
                  </div>
                  <h4 className="font-bold mb-1">Farcaster</h4>
                  <p className="text-sm text-gray-400">Social Protocol</p>
                </div>
                <div>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-3">
                    <span className="text-2xl">📦</span>
                  </div>
                  <h4 className="font-bold mb-1">IPFS</h4>
                  <p className="text-sm text-gray-400">Decentralized Storage</p>
                </div>
                <div>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-green-500/20 flex items-center justify-center mb-3">
                    <span className="text-2xl">💎</span>
                  </div>
                  <h4 className="font-bold mb-1">Solidity</h4>
                  <p className="text-sm text-gray-400">Smart Contracts</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Roadmap */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold font-display mb-8 text-center">
              Roadmap
            </h2>
            <div className="space-y-4">
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-pulse-success flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">Phase 1: MVP Launch</h4>
                  <p className="text-sm text-gray-400">Core contracts, basic UI, Farcaster Frame integration</p>
                </div>
                <span className="badge-success">Complete</span>
              </div>
              
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-pulse-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">Phase 2: Creator Tokens</h4>
                  <p className="text-sm text-gray-400">Social tokens for creators, tipping, token-gated content</p>
                </div>
                <span className="badge">Planned</span>
              </div>
              
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-pulse-card border border-pulse-border flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">Phase 3: DAO Governance</h4>
                  <p className="text-sm text-gray-400">Community governance, content moderation, treasury management</p>
                </div>
                <span className="badge">Future</span>
              </div>
              
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-pulse-card border border-pulse-border flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">Phase 4: Cross-Chain</h4>
                  <p className="text-sm text-gray-400">Expand to other chains, cross-chain identity, multi-chain rewards</p>
                </div>
                <span className="badge">Future</span>
              </div>
            </div>
          </section>
          
          {/* CTA */}
          <section className="text-center">
            <div className="glass-card p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pulse-primary/10 via-pulse-secondary/10 to-pulse-accent/10" />
              <div className="relative">
                <Heart className="w-12 h-12 text-pulse-accent mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-display mb-4">
                  Join the BasePulse Community
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Be part of the future of social media. Create your profile, 
                  share your voice, and earn from your influence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/profile/create" className="btn-primary inline-flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a 
                    href="https://github.com/basepulse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <Code className="w-5 h-5" />
                    View Source
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

