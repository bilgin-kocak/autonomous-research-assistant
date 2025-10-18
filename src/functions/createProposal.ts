/**
 * Create Proposal Function
 * Creates on-chain research funding proposals
 */

import {
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus
} from '@virtuals-protocol/game';
import { ethers } from 'ethers';
import { Logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

/**
 * Load contract configuration
 */
function loadContractConfig(): any {
  try {
    const contractPath = path.join(__dirname, '../../config/contract.json');
    if (!fs.existsSync(contractPath)) {
      throw new Error('Contract not deployed. Run deployment first.');
    }
    return JSON.parse(fs.readFileSync(contractPath, 'utf-8'));
  } catch (error: any) {
    Logger.error('Failed to load contract config', error);
    throw error;
  }
}

/**
 * Load contract ABI
 */
function loadContractABI(): any[] {
  try {
    const abiPath = path.join(__dirname, '../../config/ResearchToken.json');
    if (!fs.existsSync(abiPath)) {
      // Return minimal ABI if file not found
      return [
        'function createProposal(string memory hypothesisId, uint256 fundingGoal, uint256 duration) external returns (uint256)',
        'function getProposal(uint256 proposalId) external view returns (tuple(string hypothesisId, address researcher, uint256 fundingGoal, uint256 currentFunding, uint256 deadline, bool funded, bool completed, string resultsHash, uint256 createdAt))',
        'function proposalCount() external view returns (uint256)'
      ];
    }
    return JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
  } catch (error: any) {
    Logger.warning('Using minimal ABI', error);
    return [
      'function createProposal(string memory hypothesisId, uint256 fundingGoal, uint256 duration) external returns (uint256)',
      'function getProposal(uint256 proposalId) external view returns (tuple(string hypothesisId, address researcher, uint256 fundingGoal, uint256 currentFunding, uint256 deadline, bool funded, bool completed, string resultsHash, uint256 createdAt))',
      'function proposalCount() external view returns (uint256)'
    ];
  }
}

/**
 * Create proposal on-chain
 */
export const createProposalFunction = new GameFunction({
  name: 'create_research_proposal',
  description:
    'Creates an on-chain research proposal for community funding. Use this after generating a high-quality hypothesis (overall score >= 8.0) that needs funding for experimental validation.',
  args: [
    {
      name: 'hypothesis_id',
      type: 'string',
      description: 'Unique identifier for the hypothesis (e.g., "hyp_20251017_001")'
    },
    {
      name: 'funding_amount_eth',
      type: 'string',
      description: 'Amount of funding needed in ETH (e.g., "0.1" for 0.1 ETH)'
    },
    {
      name: 'duration_days',
      type: 'string',
      description: 'Number of days to keep proposal open for funding (1-90 days)'
    }
  ] as const,
  executable: async (args, logger) => {
    const startTime = Date.now();

    try {
      const { hypothesis_id, funding_amount_eth, duration_days } = args;

      // Validate required arguments
      if (!hypothesis_id || !funding_amount_eth || !duration_days) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          'Missing required arguments: hypothesis_id, funding_amount_eth, and duration_days are all required'
        );
      }

      Logger.info(
        `Creating on-chain proposal for hypothesis: ${hypothesis_id}`
      );
      Logger.debug('Proposal parameters', {
        hypothesis_id,
        funding_amount_eth,
        duration_days
      });

      // Validate inputs
      const fundingAmount = parseFloat(funding_amount_eth as string);
      const durationDays = parseInt(duration_days as string, 10);

      if (isNaN(fundingAmount) || fundingAmount <= 0) {
        throw new Error('Invalid funding amount');
      }

      if (isNaN(durationDays) || durationDays < 1 || durationDays > 90) {
        throw new Error('Duration must be between 1 and 90 days');
      }

      // Load contract configuration
      const contractConfig = loadContractConfig();
      const contractABI = loadContractABI();

      Logger.debug('Contract configuration loaded', {
        address: contractConfig.address,
        network: contractConfig.network
      });

      // Connect to Base Sepolia
      const rpcUrl =
        process.env.BASE_RPC_URL || 'https://sepolia.base.org';
      const provider = new ethers.JsonRpcProvider(rpcUrl);

      // Get wallet
      const privateKey = process.env.WALLET_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('WALLET_PRIVATE_KEY not configured');
      }

      const wallet = new ethers.Wallet(privateKey as string, provider);
      Logger.debug('Wallet connected', { address: wallet.address });

      // Check balance
      const balance = await provider.getBalance(wallet.address);
      const balanceEth = ethers.formatEther(balance);
      Logger.debug('Wallet balance', { balance: balanceEth + ' ETH' });

      if (balance === 0n) {
        throw new Error(
          'Insufficient balance. Get testnet ETH from Base Sepolia faucet.'
        );
      }

      // Create contract instance
      const contract = new ethers.Contract(
        contractConfig.address,
        contractABI,
        wallet
      );

      // Convert parameters
      const fundingGoalWei = ethers.parseEther(funding_amount_eth as string);
      const durationSeconds = BigInt(durationDays * 24 * 60 * 60);

      Logger.info('Submitting transaction to Base Sepolia...');

      // Create proposal transaction
      const tx = await contract.createProposal(
        hypothesis_id,
        fundingGoalWei,
        durationSeconds
      );

      Logger.info('Transaction submitted', { hash: tx.hash });
      Logger.info('Waiting for confirmation...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      Logger.info('✓ Transaction confirmed!', {
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      });

      // Get proposal ID from transaction receipt
      let proposalId: string | undefined;
      if (receipt.logs && receipt.logs.length > 0) {
        try {
          const proposalCreatedEvent = receipt.logs.find((log: any) => {
            try {
              const parsedLog = contract.interface.parseLog(log);
              return parsedLog?.name === 'ProposalCreated';
            } catch {
              return false;
            }
          });

          if (proposalCreatedEvent) {
            const parsedLog = contract.interface.parseLog(proposalCreatedEvent);
            proposalId = parsedLog?.args[0]?.toString();
          }
        } catch (error: any) {
          Logger.warning('Could not parse proposal ID from event', error);
        }
      }

      // If we couldn't get proposal ID from event, get the latest proposal count
      if (!proposalId) {
        try {
          const count = await contract.proposalCount();
          proposalId = (count - 1n).toString();
        } catch (error: any) {
          Logger.warning('Could not get proposal count', error);
          proposalId = 'unknown';
        }
      }

      const duration = Date.now() - startTime;
      Logger.trackAPICall('Base Sepolia', duration, true);

      // Log proposal creation
      Logger.log(
        'PROPOSAL_CREATION' as any,
        `Created on-chain proposal ${proposalId}`,
        {
          proposalId,
          hypothesis_id,
          fundingAmountETH: funding_amount_eth,
          durationDays: duration_days,
          txHash: tx.hash,
          blockNumber: receipt.blockNumber
        }
      );

      const responseData = {
        success: true,
        proposalId: proposalId,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        hypothesis_id: hypothesis_id,
        fundingAmountETH: funding_amount_eth,
        durationDays: duration_days,
        explorerUrl: `https://sepolia.basescan.org/tx/${tx.hash}`,
        message: `Proposal ${proposalId} created successfully! View on BaseScan.`
      };

      Logger.info('Proposal created successfully', responseData);

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify(responseData, null, 2)
      );
    } catch (error: any) {
      const duration = Date.now() - startTime;
      Logger.trackAPICall('Base Sepolia', duration, false, error.message);

      Logger.error('Proposal creation failed', {
        error: error.message,
        stack: error.stack
      });

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        `Failed to create proposal: ${error.message}`
      );
    }
  }
});

/**
 * Helper function to create proposal directly (for testing)
 */
export async function createProposal(
  hypothesisId: string,
  fundingAmountEth: string,
  durationDays: number
): Promise<any> {
  const response = await createProposalFunction.executable(
    {
      hypothesis_id: hypothesisId,
      funding_amount_eth: fundingAmountEth,
      duration_days: durationDays.toString()
    },
    (msg: string) => console.log(msg)
  );

  if (response.status === ExecutableGameFunctionStatus.Done) {
    return JSON.parse(response.feedback);
  } else {
    throw new Error(response.feedback);
  }
}
