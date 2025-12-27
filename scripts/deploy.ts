import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * BasePulse Deployment Script
 * 
 * Deploys all three contracts:
 * 1. ProfileNFT - Soulbound profile NFTs
 * 2. PostRegistry - Social posts registry
 * 3. EngagementRewards - Like-to-earn mechanism
 * 
 * Usage:
 * - Base Sepolia: npx hardhat run scripts/deploy.ts --network baseSepolia
 * - Base Mainnet: npx hardhat run scripts/deploy.ts --network baseMainnet
 */

interface DeploymentAddresses {
  network: string;
  chainId: number;
  profileNFT: string;
  postRegistry: string;
  engagementRewards: string;
  treasury: string;
  deployer: string;
  timestamp: string;
  blockNumber: number;
}

async function main() {
  console.log("🚀 Starting BasePulse deployment...\n");
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("📍 Network:", network.name);
  console.log("👤 Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH\n");
  
  // Treasury address (use deployer for testing, set proper address for mainnet)
  const treasuryAddress = process.env.TREASURY_ADDRESS || deployer.address;
  console.log("🏦 Treasury:", treasuryAddress);
  
  // Minimum like fee (0.0001 ETH = 100000000000000 wei)
  const minLikeFee = ethers.parseEther("0.0001");
  console.log("💸 Min Like Fee:", ethers.formatEther(minLikeFee), "ETH\n");
  
  // ========== Deploy ProfileNFT ==========
  console.log("📝 Deploying ProfileNFT...");
  const ProfileNFT = await ethers.getContractFactory("ProfileNFT");
  const profileNFT = await ProfileNFT.deploy();
  await profileNFT.waitForDeployment();
  const profileNFTAddress = await profileNFT.getAddress();
  console.log("✅ ProfileNFT deployed to:", profileNFTAddress);
  
  // ========== Deploy PostRegistry ==========
  console.log("\n📝 Deploying PostRegistry...");
  const PostRegistry = await ethers.getContractFactory("PostRegistry");
  const postRegistry = await PostRegistry.deploy(profileNFTAddress);
  await postRegistry.waitForDeployment();
  const postRegistryAddress = await postRegistry.getAddress();
  console.log("✅ PostRegistry deployed to:", postRegistryAddress);
  
  // ========== Deploy EngagementRewards ==========
  console.log("\n📝 Deploying EngagementRewards...");
  const EngagementRewards = await ethers.getContractFactory("EngagementRewards");
  const engagementRewards = await EngagementRewards.deploy(
    postRegistryAddress,
    treasuryAddress,
    minLikeFee
  );
  await engagementRewards.waitForDeployment();
  const engagementRewardsAddress = await engagementRewards.getAddress();
  console.log("✅ EngagementRewards deployed to:", engagementRewardsAddress);
  
  // ========== Save Deployment Addresses ==========
  const deployment: DeploymentAddresses = {
    network: network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    profileNFT: profileNFTAddress,
    postRegistry: postRegistryAddress,
    engagementRewards: engagementRewardsAddress,
    treasury: treasuryAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save to JSON file
  const filename = `${network.name}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deployment, null, 2)
  );
  
  // Also save as latest
  fs.writeFileSync(
    path.join(deploymentsDir, `${network.name}-latest.json`),
    JSON.stringify(deployment, null, 2)
  );
  
  console.log("\n📁 Deployment saved to:", path.join("deployments", filename));
  
  // ========== Summary ==========
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log(`   ProfileNFT:        ${profileNFTAddress}`);
  console.log(`   PostRegistry:      ${postRegistryAddress}`);
  console.log(`   EngagementRewards: ${engagementRewardsAddress}`);
  console.log("\n📝 Update your .env.local with:");
  console.log(`   NEXT_PUBLIC_PROFILE_NFT_ADDRESS=${profileNFTAddress}`);
  console.log(`   NEXT_PUBLIC_POST_REGISTRY_ADDRESS=${postRegistryAddress}`);
  console.log(`   NEXT_PUBLIC_ENGAGEMENT_REWARDS_ADDRESS=${engagementRewardsAddress}`);
  console.log("\n" + "=".repeat(60));
  
  // Verification reminder
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n⏳ Waiting 30 seconds before verification...");
    console.log("   Run verification with: npm run verify:" + 
      (network.name === "baseSepolia" ? "sepolia" : "mainnet"));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

