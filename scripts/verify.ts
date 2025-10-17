import { run } from "hardhat";
import contractInfo from "../config/contract.json";

/**
 * Verification script for ResearchToken contract
 *
 * Usage:
 *   npx hardhat run scripts/verify.ts --network baseSepolia
 *
 * Requirements:
 *   - BASESCAN_API_KEY in .env
 *   - Contract must be deployed (run deploy.ts first)
 */
async function main() {
  console.log("=".repeat(70));
  console.log("🔍 Verifying ResearchToken Contract");
  console.log("=".repeat(70));
  console.log();

  const contractAddress = contractInfo.address;

  if (!contractAddress) {
    throw new Error("Contract address not found. Run deployment first.");
  }

  console.log("Contract Address:", contractAddress);
  console.log("Network:", contractInfo.network);
  console.log();

  console.log("Verifying contract on BaseScan...");
  console.log();

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log();
    console.log("=".repeat(70));
    console.log("✅ Contract Verified Successfully!");
    console.log("=".repeat(70));
    console.log();
    console.log("View verified contract at:");
    console.log(`https://sepolia.basescan.org/address/${contractAddress}#code`);
    console.log();
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✓ Contract already verified on BaseScan");
      console.log();
      console.log("View at:");
      console.log(`https://sepolia.basescan.org/address/${contractAddress}#code`);
      console.log();
    } else {
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Verification failed:");
    console.error(error);
    process.exit(1);
  });
