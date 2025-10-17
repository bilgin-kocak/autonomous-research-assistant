import hre from "hardhat";
import "@nomicfoundation/hardhat-toolbox";
import fs from "fs";
import path from "path";

/**
 * Deployment script for ResearchToken contract on Base Sepolia
 *
 * Usage:
 *   npx hardhat run scripts/deploy.ts --network baseSepolia
 *
 * Requirements:
 *   - BASE_RPC_URL in .env
 *   - WALLET_PRIVATE_KEY in .env
 *   - Testnet ETH in wallet (get from Base Sepolia faucet)
 */
async function main() {
  console.log("=".repeat(70));
  console.log("🚀 Deploying ResearchToken Contract");
  console.log("=".repeat(70));
  console.log();

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from address:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log();

  if (balance === 0n) {
    console.log("⚠️  WARNING: Account has 0 ETH. Get testnet ETH from:");
    console.log("   https://www.alchemy.com/faucets/base-sepolia");
    console.log();
    throw new Error("Insufficient balance for deployment");
  }

  // Deploy contract
  console.log("Deploying ResearchToken...");
  const ResearchToken = await hre.ethers.getContractFactory("ResearchToken");
  const researchToken = await ResearchToken.deploy();

  await researchToken.waitForDeployment();
  const contractAddress = await researchToken.getAddress();

  console.log("✅ ResearchToken deployed to:", contractAddress);
  console.log();

  // Get contract details
  const name = await researchToken.name();
  const symbol = await researchToken.symbol();
  const decimals = await researchToken.decimals();
  const totalSupply = await researchToken.totalSupply();
  const owner = await researchToken.owner();

  console.log("Contract Details:");
  console.log(`  Name: ${name}`);
  console.log(`  Symbol: ${symbol}`);
  console.log(`  Decimals: ${decimals}`);
  console.log(`  Total Supply: ${hre.ethers.formatEther(totalSupply)} ${symbol}`);
  console.log(`  Owner: ${owner}`);
  console.log();

  // Save contract address and ABI
  const configDir = path.join(__dirname, "../config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const contractInfo = {
    address: contractAddress,
    name: name,
    symbol: symbol,
    decimals: Number(decimals),
    totalSupply: hre.ethers.formatEther(totalSupply),
    owner: owner,
    network: "baseSepolia",
    deployedAt: new Date().toISOString(),
    deployer: deployer.address
  };

  const contractPath = path.join(configDir, "contract.json");
  fs.writeFileSync(contractPath, JSON.stringify(contractInfo, null, 2));
  console.log("✅ Contract info saved to:", contractPath);
  console.log();

  // Save ABI
  const artifact = await hre.ethers.getContractFactory("ResearchToken");
  const abi = artifact.interface.formatJson();
  const abiPath = path.join(configDir, "ResearchToken.json");
  fs.writeFileSync(abiPath, abi);
  console.log("✅ Contract ABI saved to:", abiPath);
  console.log();

  // Display verification command
  console.log("=".repeat(70));
  console.log("📝 Next Steps");
  console.log("=".repeat(70));
  console.log();
  console.log("1. Verify contract on BaseScan:");
  console.log(`   npx hardhat verify --network baseSepolia ${contractAddress}`);
  console.log();
  console.log("2. View on BaseScan:");
  console.log(`   https://sepolia.basescan.org/address/${contractAddress}`);
  console.log();
  console.log("3. Update .env with contract address:");
  console.log(`   RESEARCH_TOKEN_ADDRESS=${contractAddress}`);
  console.log();

  console.log("=".repeat(70));
  console.log("✨ Deployment Complete!");
  console.log("=".repeat(70));
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
