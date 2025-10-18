import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { parseEther } from 'viem';
import type { Hypothesis } from '../types';
import { getScoreColor, getScoreBgColor } from '../types';

interface HypothesisListProps {
  hypotheses: Hypothesis[];
  loading: boolean;
}

const HypothesisList: React.FC<HypothesisListProps> = ({ hypotheses, loading }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [fundingState, setFundingState] = useState<{ [key: string]: 'idle' | 'pending' | 'success' | 'error' }>({});
  const [txHash, setTxHash] = useState<{ [key: string]: string }>({});

  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <div className="h-6 bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hypotheses.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          💡 Research Hypotheses
        </h2>
        <p className="text-gray-400 text-center py-8">
          No hypotheses generated yet. The agent is analyzing papers...
        </p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  /**
   * handleCreateProposal - Creates an on-chain funding proposal for an approved hypothesis
   *
   * This function enables users to convert AI-approved hypotheses into blockchain-based
   * funding proposals that the community can then fund. The workflow:
   *
   * 1. Authenticates user via Privy
   * 2. Calls ResearchToken.sol createProposal() on Base Sepolia
   * 3. Proposal stored on-chain with: hypothesisId, 0.1 ETH goal, 30 day duration
   * 4. Returns proposalId that can be used for funding
   * 5. Proposal appears in "Funding Proposals" tab
   *
   * @param hypothesis - The approved hypothesis to create a proposal for
   * @returns Promise<void>
   */
  const handleCreateProposal = async (hypothesis: Hypothesis) => {
    // Check authentication - trigger Privy login if not authenticated
    if (!ready || !authenticated) {
      login();
      return;
    }

    // Get user's wallet from Privy (embedded or external Web3 wallet)
    const wallet = wallets[0];
    if (!wallet) {
      alert('No wallet found. Please connect a wallet first.');
      return;
    }

    try {
      // Set button to loading state
      setFundingState(prev => ({ ...prev, [hypothesis.id]: 'pending' }));

      // Get Ethereum provider from Privy wallet
      const ethereumProvider = await wallet.getEthereumProvider();

      // Dynamically import ethers.js to reduce bundle size
      const { BrowserProvider, Contract, parseEther: parseEtherEthers } = await import('ethers');

      // Create ethers provider and get signer
      const provider = new BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();

      // ResearchToken.sol contract on Base Sepolia
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x1221aBCe7D8FB1ba4cF9293E94539cb45e7857fE';

      // Minimal ABI - only the createProposal function
      // This function creates a new funding proposal and returns the proposalId
      const contractABI = [
        'function createProposal(string memory hypothesisId, uint256 fundingGoal, uint256 duration) external returns (uint256)'
      ];

      // Create contract instance connected to user's signer
      const contract = new Contract(contractAddress, contractABI, signer);

      // Proposal parameters
      // - fundingGoal: 0.1 ETH (100000000000000000 wei)
      // - duration: 30 days in seconds (2592000 seconds)
      const fundingGoal = parseEtherEthers('0.1');
      const duration = 30 * 24 * 60 * 60; // 30 days

      console.log('Creating proposal on-chain...', {
        hypothesisId: hypothesis.id,
        fundingGoal: '0.1 ETH',
        duration: '30 days'
      });

      // Call smart contract function
      // This creates a proposal on-chain that can be funded by the community
      const tx = await contract.createProposal(
        hypothesis.id,
        fundingGoal,
        duration
      );

      console.log('Transaction sent:', tx.hash);

      // Wait for transaction to be mined on Base Sepolia
      const receipt = await tx.wait();

      // Update button to success state
      setFundingState(prev => ({ ...prev, [hypothesis.id]: 'success' }));

      // Store transaction hash for BaseScan link
      setTxHash(prev => ({ ...prev, [hypothesis.id]: tx.hash }));

      console.log('Proposal created!', {
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      });

      // Notify user - proposal now visible in Proposals tab
      alert(`✅ Proposal created successfully!\n\nView your proposal in the "Funding Proposals" tab.`);
    } catch (error) {
      console.error('Proposal creation error:', error);

      // Update button to error state
      setFundingState(prev => ({ ...prev, [hypothesis.id]: 'error' }));

      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      alert(`Failed to create proposal: ${errorMessage}`);

      // Auto-reset error state after 3 seconds
      setTimeout(() => {
        setFundingState(prev => ({ ...prev, [hypothesis.id]: 'idle' }));
      }, 3000);
    }
  };

  const ScoreBadge: React.FC<{ label: string; score: number }> = ({ label, score }) => (
    <div className="flex flex-col items-center">
      <div className={`text-xs font-medium ${getScoreColor(score)} mb-1`}>
        {score.toFixed(1)}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="text-2xl mr-2">💡</span>
          Research Hypotheses
        </h2>
        <span className="text-sm text-gray-400">
          {hypotheses.length} hypothesis{hypotheses.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {hypotheses.map((hypothesis) => {
          const isExpanded = expandedId === hypothesis.id;

          return (
            <div
              key={hypothesis.id}
              className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        hypothesis.approved
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {hypothesis.approved ? '✓ Approved' : '✗ Rejected'}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                        {hypothesis.field}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-white leading-relaxed">
                      {hypothesis.hypothesis}
                    </h3>
                  </div>

                  {/* Overall Score */}
                  <div className={`ml-4 flex flex-col items-center px-4 py-2 rounded-lg ${getScoreBgColor(hypothesis.overall_score)}`}>
                    <div className={`text-2xl font-bold ${getScoreColor(hypothesis.overall_score)}`}>
                      {hypothesis.overall_score.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">Overall</div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-900/50 rounded-lg">
                  <ScoreBadge label="Novelty" score={hypothesis.novelty_score} />
                  <ScoreBadge label="Feasibility" score={hypothesis.feasibility_score} />
                  <ScoreBadge label="Impact" score={hypothesis.impact_score} />
                  <ScoreBadge label="Rigor" score={hypothesis.rigor_score} />
                </div>

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="space-x-3">
                    <span>Generated: {new Date(hypothesis.generated_at).toLocaleDateString()}</span>
                    {hypothesis.reviewed_at && (
                      <span>Reviewed: {new Date(hypothesis.reviewed_at).toLocaleDateString()}</span>
                    )}
                    {hypothesis.datasets_found !== undefined && (
                      <span className="text-green-400">
                        📊 {hypothesis.datasets_found} datasets found
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleExpand(hypothesis.id)}
                    className="text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    {isExpanded ? '↑ Show less' : '↓ Show details'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-700 p-5 space-y-4">
                  {/* Strengths */}
                  {hypothesis.strengths && hypothesis.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">
                        ✓ Strengths
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {hypothesis.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-gray-300">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {hypothesis.weaknesses && hypothesis.weaknesses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-2">
                        ✗ Weaknesses
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {hypothesis.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm text-gray-300">
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {hypothesis.recommendations && hypothesis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-400 mb-2">
                        💡 Recommendations
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {hypothesis.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-gray-300">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Feedback */}
                  {hypothesis.feedback && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">
                        📝 Peer Review Feedback
                      </h4>
                      <p className="text-sm text-gray-300">{hypothesis.feedback}</p>
                    </div>
                  )}

                  {/* Create Proposal Button */}
                  {hypothesis.approved && (
                    <div className="pt-3 border-t border-gray-700 space-y-2">
                      <button
                        className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
                          fundingState[hypothesis.id] === 'pending'
                            ? 'bg-gray-600 cursor-not-allowed'
                            : fundingState[hypothesis.id] === 'success'
                            ? 'bg-green-600 hover:bg-green-700'
                            : fundingState[hypothesis.id] === 'error'
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-primary-500 hover:bg-primary-600'
                        } text-white`}
                        onClick={() => handleCreateProposal(hypothesis)}
                        disabled={fundingState[hypothesis.id] === 'pending'}
                      >
                        {fundingState[hypothesis.id] === 'pending' && '⏳ Creating Proposal...'}
                        {fundingState[hypothesis.id] === 'success' && '✅ Proposal Created!'}
                        {fundingState[hypothesis.id] === 'error' && '❌ Failed - Try Again'}
                        {!fundingState[hypothesis.id] || fundingState[hypothesis.id] === 'idle' ? '📝 Create On-Chain Proposal' : ''}
                      </button>

                      {/* Transaction Hash Link */}
                      {txHash[hypothesis.id] && (
                        <a
                          href={`https://sepolia.basescan.org/tx/${txHash[hypothesis.id]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center text-sm text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          View on BaseScan ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HypothesisList;
