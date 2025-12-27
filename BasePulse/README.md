# 🔵 BasePulse

> **The first SocialFi platform native to Base blockchain**

BasePulse is a decentralized social application that combines on-chain identity, content ownership, and economic incentives. Built for the Base ecosystem and integrated with Farcaster.

![Base](https://img.shields.io/badge/Base-0052FF?style=flat&logo=coinbase&logoColor=white)
![Farcaster](https://img.shields.io/badge/Farcaster-8B5CF6?style=flat&logo=farcaster&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=flat&logo=solidity&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

---

## ✨ Features

- **🆔 Soulbound Profiles** - Non-transferable NFT profiles representing on-chain identity
- **📝 On-Chain Posts** - Content stored on IPFS, registered on Base blockchain
- **💰 Like-to-Earn** - Creators earn 70% of like fees, likers get 10% back
- **🟣 Farcaster Integration** - Works as a Farcaster Mini App (Frames v2)
- **📱 Mobile-First** - Optimized for Coinbase Wallet and mobile experience
- **🔗 Wallet Integration** - Reown AppKit with WalletConnect support

---

## 🏗 Architecture

```
BasePulse/
├── contracts/               # Solidity smart contracts
│   ├── ProfileNFT.sol       # Soulbound profile NFTs
│   ├── PostRegistry.sol     # Post creation and engagement
│   └── EngagementRewards.sol # Like-to-earn mechanism
├── scripts/                 # Deployment scripts
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── api/             # API routes (Frame, IPFS, OG)
│   │   ├── feed/            # Feed page
│   │   ├── profile/         # Profile pages
│   │   ├── create/          # Create post page
│   │   └── about/           # About page
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utility libraries
├── hardhat.config.ts        # Hardhat configuration
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A wallet with Base Sepolia ETH for testing

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/basepulse.git
cd basepulse

# Install dependencies
npm install

# Copy environment file
cp env.example .env.local
```

### Environment Variables

Edit `.env.local` with your values:

```env
# Required
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=77884856b831105bd4f378651847d91e
NEXT_PUBLIC_CHAIN_ENV=baseSepolia

# Contract Addresses (after deployment)
NEXT_PUBLIC_PROFILE_NFT_ADDRESS=
NEXT_PUBLIC_POST_REGISTRY_ADDRESS=
NEXT_PUBLIC_ENGAGEMENT_REWARDS_ADDRESS=

# IPFS (Pinata)
PINATA_JWT=your_pinata_jwt_token

# For Deployment
DEPLOYER_PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_basescan_api_key
TREASURY_ADDRESS=your_treasury_address
```

### Local Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Smart Contracts

### ProfileNFT.sol
ERC-721 Soulbound NFT for user profiles.

- One profile per wallet (non-transferable)
- IPFS metadata storage
- Farcaster FID linking support

### PostRegistry.sol
On-chain registry for social posts.

- Create posts with IPFS content URIs
- Like, comment, and repost functionality
- Event-driven feed construction

### EngagementRewards.sol
Like-to-earn economic mechanism.

- **70%** → Content creator
- **20%** → Platform treasury
- **10%** → Liker (engagement incentive)

---

## 🔧 Deployment

### Compile Contracts

```bash
npm run compile
```

### Deploy to Base Sepolia (Testnet)

```bash
# Ensure your .env.local has:
# - DEPLOYER_PRIVATE_KEY (funded with Sepolia ETH)
# - BASESCAN_API_KEY (optional, for verification)

npm run deploy:sepolia
```

### Deploy to Base Mainnet

```bash
npm run deploy:mainnet
```

### Verify Contracts

```bash
npm run verify:sepolia
# or
npm run verify:mainnet
```

After deployment, update your `.env.local` with the contract addresses.

---

## 🟣 Farcaster Mini App

BasePulse works as a Farcaster Mini App (Frames v2).

### Frame Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/frame` | Main Frame handler |
| `/api/frame/tx/paid-like` | Paid like transaction |
| `/api/frame/tx/link-farcaster` | Link Farcaster FID |
| `/api/og` | Dynamic OG image generator |
| `/.well-known/farcaster.json` | App manifest |

### Registering with Farcaster

1. Deploy your app to a public URL
2. Ensure `/.well-known/farcaster.json` is accessible
3. Register at [Warpcast Developer Hub](https://warpcast.com/~/developers)
4. Submit your Frame URL for verification

### Testing Frames

Use the [Farcaster Frame Debugger](https://warpcast.com/~/developers/frames) to test your Frame interactions.

---

## 💼 Wallet Integration

BasePulse uses **Reown AppKit** (formerly WalletConnect v2) for wallet connections.

### Supported Wallets

- **Coinbase Wallet** (prioritized for Base ecosystem)
- MetaMask
- Rainbow
- Trust Wallet
- Any WalletConnect-compatible wallet

### Configuration

The wallet integration is configured in `src/app/providers.tsx`:

```typescript
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  networks: [base, baseSepolia],
  // Coinbase Wallet prioritized
  featuredWalletIds: [
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
  ],
});
```

---

## 🎯 Talent.app Base Builder Campaign

This project is optimized for the **Talent.app Base Builder Score** campaign.

### Builder Score Optimization

| Criteria | Implementation |
|----------|---------------|
| **Base Native** | ✅ Built exclusively for Base Mainnet/Sepolia |
| **Smart Contracts** | ✅ 3 production-ready contracts |
| **Farcaster Integration** | ✅ Frames v2 Mini App support |
| **Wallet Integration** | ✅ Reown AppKit with Coinbase priority |
| **Open Source** | ✅ Full source code available |
| **On-chain Activity** | ✅ Profile NFTs, posts, engagement rewards |

### Campaign Summary

> **BasePulse** is a SocialFi dApp that brings creator economics to social media on Base. Users mint soulbound profile NFTs, create on-chain posts stored on IPFS, and participate in a like-to-earn economy where creators earn 70% of engagement fees. The platform integrates seamlessly with Farcaster as a Mini App, allowing users to interact directly from Warpcast.

---

## 🔮 Future Roadmap

### Phase 2: Creator Tokens
- Social token creation per profile
- Token-gated content
- Creator token tipping

### Phase 3: DAO Governance
- Community governance token
- Content moderation DAO
- Treasury management

### Phase 4: Cross-Chain
- Multi-chain profile linking
- Cross-chain content syndication

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Base (Ethereum L2) |
| Smart Contracts | Solidity 0.8.24, Hardhat |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Wallet | Reown AppKit, WalletConnect, wagmi |
| Storage | IPFS (Pinata) |
| Social | Farcaster Frames v2 |

---

## 🛠 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run compile      # Compile smart contracts
npm run test         # Run contract tests
npm run deploy:sepolia   # Deploy to Base Sepolia
npm run deploy:mainnet   # Deploy to Base Mainnet
npm run verify:sepolia   # Verify on Sepolia Basescan
npm run verify:mainnet   # Verify on Mainnet Basescan
```

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── frame/         # Farcaster Frame endpoints
│   │   ├── ipfs/          # IPFS upload endpoints
│   │   └── og/            # OG image generation
│   ├── feed/              # Feed page
│   ├── profile/           # Profile pages
│   ├── create/            # Create post page
│   └── about/             # About page
├── components/            # React components
│   ├── feed/              # Feed-related components
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks
│   └── useContracts.ts    # Contract interaction hooks
└── lib/                   # Utilities
    ├── contracts.ts       # Contract ABIs and addresses
    ├── farcaster.ts       # Farcaster utilities
    ├── ipfs.ts            # IPFS utilities
    └── utils.ts           # General utilities
```

---

## 🔐 Security

- Private keys and secrets are never hardcoded
- All sensitive values use environment variables
- Smart contracts use OpenZeppelin battle-tested implementations
- ReentrancyGuard protects against reentrancy attacks
- Soulbound NFTs prevent profile trading/manipulation

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

## 📞 Support

- [GitHub Issues](https://github.com/your-repo/basepulse/issues)
- [Farcaster](https://warpcast.com/basepulse)
- [Twitter/X](https://twitter.com/basepulse)

---

<p align="center">
  <strong>Built with 💙 for the Base ecosystem</strong>
</p>

