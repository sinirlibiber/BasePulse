import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("BasePulse Contracts", function () {
  // Fixture to deploy all contracts
  async function deployContractsFixture() {
    const [owner, user1, user2, treasury] = await ethers.getSigners();
    
    // Deploy ProfileNFT
    const ProfileNFT = await ethers.getContractFactory("ProfileNFT");
    const profileNFT = await ProfileNFT.deploy();
    
    // Deploy PostRegistry
    const PostRegistry = await ethers.getContractFactory("PostRegistry");
    const postRegistry = await PostRegistry.deploy(await profileNFT.getAddress());
    
    // Deploy EngagementRewards
    const minLikeFee = ethers.parseEther("0.0001");
    const EngagementRewards = await ethers.getContractFactory("EngagementRewards");
    const engagementRewards = await EngagementRewards.deploy(
      await postRegistry.getAddress(),
      treasury.address,
      minLikeFee
    );
    
    return { profileNFT, postRegistry, engagementRewards, owner, user1, user2, treasury, minLikeFee };
  }
  
  describe("ProfileNFT", function () {
    it("Should create a profile", async function () {
      const { profileNFT, user1 } = await loadFixture(deployContractsFixture);
      
      const metadataURI = "ipfs://QmTest123";
      await profileNFT.connect(user1).createProfile(metadataURI);
      
      expect(await profileNFT.hasProfile(user1.address)).to.be.true;
      expect(await profileNFT.balanceOf(user1.address)).to.equal(1);
    });
    
    it("Should not allow duplicate profiles", async function () {
      const { profileNFT, user1 } = await loadFixture(deployContractsFixture);
      
      await profileNFT.connect(user1).createProfile("ipfs://QmTest1");
      
      await expect(
        profileNFT.connect(user1).createProfile("ipfs://QmTest2")
      ).to.be.revertedWithCustomError(profileNFT, "AlreadyHasProfile");
    });
    
    it("Should not allow transfers (soulbound)", async function () {
      const { profileNFT, user1, user2 } = await loadFixture(deployContractsFixture);
      
      await profileNFT.connect(user1).createProfile("ipfs://QmTest");
      const tokenId = await profileNFT.profileOf(user1.address);
      
      await expect(
        profileNFT.connect(user1).transferFrom(user1.address, user2.address, tokenId)
      ).to.be.revertedWithCustomError(profileNFT, "SoulboundTokenCannotBeTransferred");
    });
    
    it("Should update profile metadata", async function () {
      const { profileNFT, user1 } = await loadFixture(deployContractsFixture);
      
      await profileNFT.connect(user1).createProfile("ipfs://QmTest1");
      await profileNFT.connect(user1).updateProfile("ipfs://QmTest2");
      
      const tokenId = await profileNFT.profileOf(user1.address);
      expect(await profileNFT.tokenURI(tokenId)).to.equal("ipfs://QmTest2");
    });
    
    it("Should link Farcaster FID", async function () {
      const { profileNFT, user1 } = await loadFixture(deployContractsFixture);
      
      await profileNFT.connect(user1).createProfile("ipfs://QmTest");
      const fid = 12345n;
      await profileNFT.connect(user1).linkFarcaster(fid);
      
      expect(await profileNFT.getAddressByFid(fid)).to.equal(user1.address);
    });
  });
  
  describe("PostRegistry", function () {
    it("Should create a post", async function () {
      const { postRegistry, user1 } = await loadFixture(deployContractsFixture);
      
      const contentURI = "ipfs://QmPostTest";
      await postRegistry.connect(user1).createPost(contentURI);
      
      const post = await postRegistry.getPost(1n);
      expect(post.author).to.equal(user1.address);
      expect(post.contentURI).to.equal(contentURI);
      expect(post.exists).to.be.true;
    });
    
    it("Should like a post", async function () {
      const { postRegistry, user1, user2 } = await loadFixture(deployContractsFixture);
      
      await postRegistry.connect(user1).createPost("ipfs://QmTest");
      await postRegistry.connect(user2).likePost(1n);
      
      const post = await postRegistry.getPost(1n);
      expect(post.likeCount).to.equal(1);
      expect(await postRegistry.checkHasLiked(1n, user2.address)).to.be.true;
    });
    
    it("Should not allow duplicate likes", async function () {
      const { postRegistry, user1, user2 } = await loadFixture(deployContractsFixture);
      
      await postRegistry.connect(user1).createPost("ipfs://QmTest");
      await postRegistry.connect(user2).likePost(1n);
      
      await expect(
        postRegistry.connect(user2).likePost(1n)
      ).to.be.revertedWithCustomError(postRegistry, "AlreadyLiked");
    });
    
    it("Should add a comment", async function () {
      const { postRegistry, user1, user2 } = await loadFixture(deployContractsFixture);
      
      await postRegistry.connect(user1).createPost("ipfs://QmPost");
      await postRegistry.connect(user2).addComment(1n, "ipfs://QmComment");
      
      const post = await postRegistry.getPost(1n);
      expect(post.commentCount).to.equal(1);
    });
    
    it("Should repost", async function () {
      const { postRegistry, user1, user2 } = await loadFixture(deployContractsFixture);
      
      await postRegistry.connect(user1).createPost("ipfs://QmTest");
      await postRegistry.connect(user2).repost(1n);
      
      const post = await postRegistry.getPost(1n);
      expect(post.repostCount).to.equal(1);
    });
  });
  
  describe("EngagementRewards", function () {
    it("Should process paid like with correct fee distribution", async function () {
      const { postRegistry, engagementRewards, user1, user2, treasury, minLikeFee } = 
        await loadFixture(deployContractsFixture);
      
      await postRegistry.connect(user1).createPost("ipfs://QmTest");
      
      const creatorBalanceBefore = await ethers.provider.getBalance(user1.address);
      const likerBalanceBefore = await ethers.provider.getBalance(user2.address);
      const treasuryBalanceBefore = await ethers.provider.getBalance(treasury.address);
      
      const tx = await engagementRewards.connect(user2).paidLike(1n, { value: minLikeFee });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      const creatorBalanceAfter = await ethers.provider.getBalance(user1.address);
      const likerBalanceAfter = await ethers.provider.getBalance(user2.address);
      const treasuryBalanceAfter = await ethers.provider.getBalance(treasury.address);
      
      // Creator gets 70%
      const creatorReward = (minLikeFee * 70n) / 100n;
      expect(creatorBalanceAfter - creatorBalanceBefore).to.be.closeTo(creatorReward, ethers.parseEther("0.00001"));
      
      // Treasury gets 20%
      const treasuryFee = (minLikeFee * 20n) / 100n;
      expect(treasuryBalanceAfter - treasuryBalanceBefore).to.equal(treasuryFee);
      
      // Liker gets 10% back (minus gas)
      const likerReward = (minLikeFee * 10n) / 100n;
      const expectedLikerChange = likerReward - minLikeFee - gasUsed;
      expect(likerBalanceAfter - likerBalanceBefore).to.be.closeTo(expectedLikerChange, ethers.parseEther("0.0001"));
    });
    
    it("Should reject insufficient fee", async function () {
      const { postRegistry, engagementRewards, user1, user2, minLikeFee } = 
        await loadFixture(deployContractsFixture);
      
      await postRegistry.connect(user1).createPost("ipfs://QmTest");
      
      await expect(
        engagementRewards.connect(user2).paidLike(1n, { value: minLikeFee / 2n })
      ).to.be.revertedWithCustomError(engagementRewards, "InsufficientFee");
    });
    
    it("Should not allow liking own post", async function () {
      const { postRegistry, engagementRewards, user1, minLikeFee } = 
        await loadFixture(deployContractsFixture);
      
      await postRegistry.connect(user1).createPost("ipfs://QmTest");
      
      await expect(
        engagementRewards.connect(user1).paidLike(1n, { value: minLikeFee })
      ).to.be.revertedWithCustomError(engagementRewards, "CannotLikeOwnPost");
    });
    
    it("Should track user stats", async function () {
      const { postRegistry, engagementRewards, user1, user2, minLikeFee } = 
        await loadFixture(deployContractsFixture);
      
      await postRegistry.connect(user1).createPost("ipfs://QmTest");
      await engagementRewards.connect(user2).paidLike(1n, { value: minLikeFee });
      
      const [given, received, earnings] = await engagementRewards.getUserStats(user1.address);
      expect(received).to.equal(1);
      expect(earnings).to.be.gt(0);
      
      const [givenByLiker, , likerEarnings] = await engagementRewards.getUserStats(user2.address);
      expect(givenByLiker).to.equal(1);
      expect(likerEarnings).to.be.gt(0);
    });
  });
});

