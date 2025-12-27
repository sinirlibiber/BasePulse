"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { WagmiProvider, type Config } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { cookieStorage, createStorage } from "wagmi";

// ============================================
// Environment Configuration
// ============================================

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "77884856b831105bd4f378651847d91e";
const chainEnv = process.env.NEXT_PUBLIC_CHAIN_ENV || "baseSepolia";

// Determine which chain to use
const activeChain = chainEnv === "baseMainnet" ? base : baseSepolia;

// ============================================
// AppKit Metadata
// ============================================

const metadata = {
  name: "BasePulse",
  description: "The first SocialFi platform native to Base. Create, engage, and earn on the decentralized social layer.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://basepulse.xyz",
  icons: ["/logo.png"],
};

// ============================================
// Wagmi Adapter Configuration
// ============================================

// Create Wagmi adapter with Reown AppKit
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks: [base, baseSepolia],
});

// ============================================
// Create AppKit Instance
// ============================================

// Initialize AppKit (only run once)
if (typeof window !== "undefined") {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [base, baseSepolia],
    defaultNetwork: activeChain,
    metadata,
    features: {
      analytics: true,
      email: false, // Social logins disabled for Web3 purity
      socials: [],
      emailShowWallets: false,
    },
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "#6366F1",
      "--w3m-color-mix": "#8B5CF6",
      "--w3m-color-mix-strength": 40,
      "--w3m-border-radius-master": "16px",
    },
    // Prioritize Coinbase Wallet for Base ecosystem
    featuredWalletIds: [
      "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase Wallet
      "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
    ],
    // Include all major wallets
    includeWalletIds: [
      "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase Wallet
      "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
      "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Rainbow
      "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
    ],
    // Allow all wallets
    allWallets: "SHOW",
  });
}

// ============================================
// Query Client
// ============================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes (previously cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// ============================================
// Providers Component
// ============================================

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// ============================================
// Export Configuration
// ============================================

export { wagmiAdapter, activeChain, projectId };

