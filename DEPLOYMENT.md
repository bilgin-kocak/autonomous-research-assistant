# Smart Contract Deployment Guide

This guide walks you through deploying the ResearchToken smart contract to Base Sepolia testnet.

## Prerequisites

Before deploying, ensure you have:

1. **Node.js dependencies installed**:
   ```bash
   npm install
   ```

2. **Base Sepolia testnet ETH** (for gas fees):
   - Get free testnet ETH from: https://www.alchemy.com/faucets/base-sepolia
   - You need approximately 0.01 ETH for deployment

3. **Environment variables configured** (`.env` file):
   ```env
   # Required for deployment
   BASE_RPC_URL=https://base-sepolia.g.alchemy.com/v2/your-api-key
   WALLET_PRIVATE_KEY=your_test_wallet_private_key

   # Optional for verification
   BASESCAN_API_KEY=your_basescan_api_key
   ```

   **IMPORTANT:**
   - Use a TEST wallet only!
   - Never use your main wallet private key
   - Get Base Sepolia RPC URL from [Alchemy](https://dashboard.alchemy.com/) or [Infura](https://infura.io/)
   - Get BaseScan API key from [BaseScan](https://basescan.org/myapikey)

## Deployment Options

### Option 1: Using Hardhat (Recommended for Production)

#### Step 1: Compile Contract

```bash
npm run compile:contracts
```

This compiles `contracts/ResearchToken.sol` and generates artifacts in `artifacts/` directory.

#### Step 2: Deploy to Base Sepolia

```bash
npm run deploy:baseSepolia
```

Expected output:
```
======================================================================
🚀 Deploying ResearchToken Contract
======================================================================

Deploying from address: 0x...
Account balance: 0.05 ETH

Deploying ResearchToken...
✅ ResearchToken deployed to: 0x...

Contract Details:
  Name: ScienceDAO Token
  Symbol: SCIDAO
  Decimals: 18
  Total Supply: 1000000 SCIDAO
  Owner: 0x...

✅ Contract info saved to: config/contract.json
✅ Contract ABI saved to: config/ResearchToken.json

======================================================================
📝 Next Steps
======================================================================

1. Verify contract on BaseScan:
   npx hardhat verify --network baseSepolia 0x...

2. View on BaseScan:
   https://sepolia.basescan.org/address/0x...

3. Update .env with contract address:
   RESEARCH_TOKEN_ADDRESS=0x...

======================================================================
✨ Deployment Complete!
======================================================================
```

#### Step 3: Verify Contract (Optional but Recommended)

```bash
npm run verify:baseSepolia
```

This publishes the contract source code to BaseScan for transparency.

### Option 2: Using Remix IDE (Faster for Hackathons)

For quick deployment without Hardhat setup:

1. **Open Remix IDE**: https://remix.ethereum.org

2. **Create new file**: `ResearchToken.sol`

3. **Copy contract code** from `contracts/ResearchToken.sol`

4. **Install OpenZeppelin**:
   - Go to Plugins → Activate "OpenZeppelin Contracts"
   - Or manually add imports

5. **Compile**:
   - Compiler: Solidity 0.8.20
   - Enable optimization (200 runs)
   - Click "Compile ResearchToken.sol"

6. **Deploy**:
   - Switch to "Deploy & Run Transactions" tab
   - Environment: "Injected Provider - MetaMask"
   - Connect MetaMask to Base Sepolia network
   - Click "Deploy"
   - Confirm transaction in MetaMask

7. **Save contract address**:
   - Copy deployed address
   - Create `config/contract.json`:
   ```json
   {
     "address": "0x...",
     "network": "baseSepolia",
     "deployedAt": "2025-10-17T..."
   }
   ```

8. **Verify on BaseScan**:
   - Go to https://sepolia.basescan.org/address/0x...
   - Click "Contract" → "Verify and Publish"
   - Select "Via Standard JSON Input"
   - Upload compiler JSON from Remix

## Post-Deployment

### 1. Update Environment Variables

Add the deployed contract address to your `.env`:

```env
RESEARCH_TOKEN_ADDRESS=0x_your_deployed_address
```

### 2. Test Contract Interaction

Run the test to ensure the agent can interact with the contract:

```bash
ts-node tests/testContractInteraction.ts
```

### 3. View on BaseScan

Your contract should be visible at:
```
https://sepolia.basescan.org/address/0x_your_deployed_address
```

## Troubleshooting

### "Insufficient funds for gas"
- Get more testnet ETH from the faucet
- Check your wallet balance on BaseScan

### "Invalid API key"
- Verify `BASE_RPC_URL` in `.env`
- Check Alchemy/Infura dashboard for correct URL

### "Private key error"
- Ensure `WALLET_PRIVATE_KEY` doesn't include "0x" prefix
- Use a test wallet only!
- Check the key has enough ETH

### "Contract verification failed"
- Wait 1-2 minutes after deployment
- Ensure compiler settings match (0.8.20, 200 optimization runs)
- Try manual verification on BaseScan

### "Module not found: hardhat"
- Run `npm install` to install all dependencies
- Check `package.json` for hardhat packages

## Contract Features

The deployed `ResearchToken` contract includes:

### Core Functions

- **`createProposal(hypothesisId, fundingGoal, duration)`**
  - Creates a new research funding proposal
  - Minimum funding: 0.001 ETH
  - Maximum funding: 10 ETH
  - Duration: 1-90 days

- **`fundProposal(proposalId, amount)`**
  - Fund an active proposal with SCIDAO tokens
  - Auto-transfers to researcher when goal reached

- **`completeResearch(proposalId, resultsHash)`**
  - Mark research as complete
  - Store IPFS hash of results

### View Functions

- **`getProposal(proposalId)`** - Get proposal details
- **`isProposalActive(proposalId)`** - Check if proposal is accepting funds
- **`getFundingProgress(proposalId)`** - Get funding percentage
- **`getProposals(offset, limit)`** - Get all proposals (paginated)

### Events

- **`ProposalCreated`** - New proposal created
- **`ProposalFunded`** - Proposal received funding
- **`FundingGoalReached`** - Proposal fully funded
- **`ResearchCompleted`** - Research results submitted

## Network Information

### Base Sepolia Testnet

- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Block Explorer**: https://sepolia.basescan.org
- **Faucet**: https://www.alchemy.com/faucets/base-sepolia

### Adding Base Sepolia to MetaMask

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.basescan.org

## Security Notes

⚠️ **IMPORTANT SECURITY REMINDERS:**

- **Never commit `.env` file** to git
- **Use test wallet only** for deployment
- **Don't share private keys** with anyone
- **Verify contract code** before mainnet deployment
- **Audit smart contracts** before handling real funds
- **Test thoroughly** on testnet first

## Support

If you encounter issues:

1. Check the [Hardhat documentation](https://hardhat.org/getting-started/)
2. Review [Base network docs](https://docs.base.org/)
3. Ask in Virtuals Discord: https://discord.gg/virtualsio
4. Check BaseScan for transaction details

## Next Steps

After successful deployment:

1. ✅ Contract deployed and verified
2. ✅ Address saved to `config/contract.json`
3. ✅ Agent can create proposals
4. → Test creating a proposal from the agent
5. → Build frontend dashboard
6. → Test end-to-end workflow

---

**Deployment Status**: Ready to deploy to Base Sepolia testnet!
