import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { parseEther } from 'viem';
import type { Proposal } from '../types';

interface ProposalsListProps {
  proposals: Proposal[];
  loading: boolean;
}

const ProposalsList: React.FC<ProposalsListProps> = ({ proposals, loading }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [fundingState, setFundingState] = useState<{ [key: string]: 'idle' | 'pending' | 'success' | 'error' }>({});
  const [txHash, setTxHash] = useState<{ [key: string]: string }>({});
  const [localFunding, setLocalFunding] = useState<{ [key: string]: number }>({});

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

  if (proposals.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          💰 Funding Proposals
        </h2>
        <p className="text-gray-400 text-center py-8">
          No proposals created yet. Approved hypotheses will appear here...
        </p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFund = async (proposalId: string) => {
    // If not authenticated, prompt login
    if (!ready || !authenticated) {
      login();
      return;
    }

    // Get the first wallet (embedded or connected)
    const wallet = wallets[0];
    if (!wallet) {
      alert('No wallet found. Please connect a wallet first.');
      return;
    }

    try {
      setFundingState(prev => ({ ...prev, [proposalId]: 'pending' }));

      // Get the Ethereum provider from the wallet
      const ethereumProvider = await wallet.getEthereumProvider();

      // Use ethers v6 BrowserProvider and Contract
      const { BrowserProvider, Contract, parseEther: parseEtherEthers } = await import('ethers');
      const provider = new BrowserProvider(ethereumProvider);
      const signer = await provider.getSigner();

      // Contract address and ABI
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x1221aBCe7D8FB1ba4cF9293E94539cb45e7857fE';

      // Minimal ABI for fundProposal function
      const contractABI = [
        'function fundProposal(uint256 proposalId, uint256 amount) external'
      ];

      // Create contract instance
      const contract = new Contract(contractAddress, contractABI, signer);

      // Funding amount
      const fundingAmount = parseEtherEthers('0.0001'); // 0.0001 ETH

      console.log('Funding proposal...', {
        proposalId,
        amount: '0.0001 ETH'
      });

      // Call fundProposal function
      const tx = await contract.fundProposal(
        proposalId,
        fundingAmount
      );

      console.log('Transaction sent:', tx.hash);

      // Wait for transaction to be mined
      await tx.wait();

      setFundingState(prev => ({ ...prev, [proposalId]: 'success' }));
      setTxHash(prev => ({ ...prev, [proposalId]: tx.hash }));

      // Update local funding state immediately (optimistic update)
      setLocalFunding(prev => ({
        ...prev,
        [proposalId]: (prev[proposalId] || 0) + 0.0001
      }));

      console.log('Funding confirmed:', tx.hash);

      // Show success message
      alert(`✅ Successfully funded proposal with 0.0001 ETH!\n\nProgress will update automatically.`);
    } catch (error) {
      console.error('Funding error:', error);
      setFundingState(prev => ({ ...prev, [proposalId]: 'error' }));

      // Show user-friendly error
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      alert(`Funding failed: ${errorMessage}`);

      // Reset error state after 3 seconds
      setTimeout(() => {
        setFundingState(prev => ({ ...prev, [proposalId]: 'idle' }));
      }, 3000);
    }
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'funded': return 'bg-blue-500/20 text-blue-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    const currentNum = Number(current) || 0;
    const goalNum = Number(goal) || 1;
    return Math.min((currentNum / goalNum) * 100, 100);
  };

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="text-2xl mr-2">💰</span>
          Funding Proposals
        </h2>
        <span className="text-sm text-gray-400">
          {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {proposals.map((proposal) => {
          const isExpanded = expandedId === proposal.id;

          // Use local funding if available, otherwise use proposal's current_funding
          const currentFunding = localFunding[proposal.id] !== undefined
            ? proposal.current_funding + localFunding[proposal.id]
            : proposal.current_funding;

          const progressPercentage = getProgressPercentage(currentFunding, proposal.funding_goal);
          const daysRemaining = getDaysRemaining(proposal.deadline);

          return (
            <div
              key={proposal.id}
              className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status.toUpperCase()}
                      </span>
                      {daysRemaining !== null && daysRemaining > 0 && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
                          {daysRemaining} days left
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-white leading-relaxed mb-2">
                      {proposal.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {proposal.description}
                    </p>
                  </div>
                </div>

                {/* Funding Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      Progress: {(Number(currentFunding) || 0).toFixed(4)} / {(Number(proposal.funding_goal) || 0).toFixed(4)} ETH
                    </span>
                    <span className="text-sm font-semibold text-primary-400">
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-400 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Voting Stats (if available) */}
                {(proposal.votes_for !== undefined || proposal.votes_against !== undefined) && (
                  <div className="flex gap-4 mb-4 p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex-1 text-center">
                      <div className="text-lg font-bold text-green-400">
                        {proposal.votes_for || 0}
                      </div>
                      <div className="text-xs text-gray-500">Votes For</div>
                    </div>
                    <div className="flex-1 text-center border-l border-gray-700">
                      <div className="text-lg font-bold text-red-400">
                        {proposal.votes_against || 0}
                      </div>
                      <div className="text-xs text-gray-500">Votes Against</div>
                    </div>
                  </div>
                )}

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="space-x-3">
                    <span>Created: {new Date(proposal.created_at).toLocaleDateString()}</span>
                    {proposal.on_chain_address && (
                      <span className="text-primary-400">
                        📍 On-chain
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleExpand(proposal.id)}
                    className="text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    {isExpanded ? '↑ Show less' : '↓ Show details'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-700 p-5 space-y-4">
                  {/* Full Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      📝 Full Description
                    </h4>
                    <p className="text-sm text-gray-300">{proposal.description}</p>
                  </div>

                  {/* On-chain Address */}
                  {proposal.on_chain_address && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">
                        ⛓️ Smart Contract Address
                      </h4>
                      <code className="text-xs font-mono text-primary-400 bg-gray-900/50 px-3 py-2 rounded block">
                        {proposal.on_chain_address}
                      </code>
                    </div>
                  )}

                  {/* Fund Button */}
                  {proposal.status === 'active' && (
                    <div className="pt-3 border-t border-gray-700 space-y-2">
                      <button
                        className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
                          fundingState[proposal.id] === 'pending'
                            ? 'bg-gray-600 cursor-not-allowed'
                            : fundingState[proposal.id] === 'success'
                            ? 'bg-green-600 hover:bg-green-700'
                            : fundingState[proposal.id] === 'error'
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-primary-500 hover:bg-primary-600'
                        } text-white`}
                        onClick={() => handleFund(proposal.id)}
                        disabled={fundingState[proposal.id] === 'pending'}
                      >
                        {fundingState[proposal.id] === 'pending' && '⏳ Processing...'}
                        {fundingState[proposal.id] === 'success' && '✅ Funded!'}
                        {fundingState[proposal.id] === 'error' && '❌ Failed - Try Again'}
                        {!fundingState[proposal.id] || fundingState[proposal.id] === 'idle' ? '💰 Fund 0.0001 ETH' : ''}
                      </button>

                      {/* Transaction Hash Link */}
                      {txHash[proposal.id] && (
                        <a
                          href={`https://sepolia.basescan.org/tx/${txHash[proposal.id]}`}
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

export default ProposalsList;
