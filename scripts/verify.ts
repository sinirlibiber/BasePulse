import { run, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * BasePulse Contract Verification Script
 * 
 * Verifies all deployed contracts on Basescan
 * 
 * Usage:
 * - Base Sepolia: npx hardhat run scripts/verify.ts --network baseSepolia
 * - Base Mainnet: npx hardhat run scripts/verify.ts --network baseMainnet
 */

async function main() {
  console.log("🔍 Starting contract verification...\n");
  
  // Load deployment addresses
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const latestFile = path.join(deploymentsDir, `${network.name}-latest.json`);
  
  if (!fs.existsSync(latestFile)) {
    console.error("❌ No deployment found for network:", network.name);
    console.error("   Run deployment first: npm run deploy:" + 
      (network.name === "baseSepolia" ? "sepolia" : "mainnet"));
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(latestFile, "utf-8"));
  
  console.log("📋 Loaded deployment from:", latestFile);
  console.log("   Deployed at:", deployment.timestamp);
  console.log("   Block:", deployment.blockNumber);
  console.log("\n");
  
  // ========== Verify ProfileNFT ==========
  console.log("📝 Verifying ProfileNFT...");
  try {
    await run("verify:verify", {
      address: deployment.profileNFT,
      constructorArguments: [],
    });
    console.log("✅ ProfileNFT verified!");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  ProfileNFT already verified");
    } else {
      console.error("❌ ProfileNFT verification failed:", error.message);
    }
  }
  
  // ========== Verify PostRegistry ==========
  console.log("\n📝 Verifying PostRegistry...");
  try {
    await run("verify:verify", {
      address: deployment.postRegistry,
      constructorArguments: [deployment.profileNFT],
    });
    console.log("✅ PostRegistry verified!");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  PostRegistry already verified");
    } else {
      console.error("❌ PostRegistry verification failed:", error.message);
    }
  }
  
  // ========== Verify EngagementRewards ==========
  console.log("\n📝 Verifying EngagementRewards...");
  const minLikeFee = "100000000000000"; // 0.0001 ETH in wei
  try {
    await run("verify:verify", {
      address: deployment.engagementRewards,
      constructorArguments: [
        deployment.postRegistry,
        deployment.treasury,
        minLikeFee,
      ],
    });
    console.log("✅ EngagementRewards verified!");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("ℹ️  EngagementRewards already verified");
    } else {
      console.error("❌ EngagementRewards verification failed:", error.message);
    }
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("🎉 VERIFICATION COMPLETE!");
  console.log("=".repeat(60));
  
  const baseUrl = network.name === "baseSepolia" 
    ? "https://sepolia.basescan.org" 
    : "https://basescan.org";
  
  console.log("\n🔗 View on Basescan:");
  console.log(`   ProfileNFT:        ${baseUrl}/address/${deployment.profileNFT}`);
  console.log(`   PostRegistry:      ${baseUrl}/address/${deployment.postRegistry}`);
  console.log(`   EngagementRewards: ${baseUrl}/address/${deployment.engagementRewards}`);
  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  });

