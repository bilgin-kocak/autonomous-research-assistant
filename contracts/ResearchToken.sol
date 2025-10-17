// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ResearchToken
 * @dev ERC20 token for ScienceDAO research funding
 *
 * Features:
 * - ERC20 governance token
 * - Research proposal creation and funding
 * - Community-driven research funding
 * - Transparent on-chain activity
 */
contract ResearchToken is ERC20, Ownable {

    /// @dev Research funding proposal structure
    struct ResearchProposal {
        string hypothesisId;        // Unique hypothesis identifier
        address researcher;         // Researcher's address
        uint256 fundingGoal;        // Target funding amount in wei
        uint256 currentFunding;     // Current funding received
        uint256 deadline;           // Funding deadline (timestamp)
        bool funded;                // Whether funding goal reached
        bool completed;             // Whether research completed
        string resultsHash;         // IPFS hash of research results
        uint256 createdAt;          // Creation timestamp
    }

    /// @dev Mapping from proposal ID to proposal data
    mapping(uint256 => ResearchProposal) public proposals;

    /// @dev Total number of proposals created
    uint256 public proposalCount;

    /// @dev Minimum funding goal (0.001 ETH)
    uint256 public constant MIN_FUNDING_GOAL = 0.001 ether;

    /// @dev Maximum funding goal (10 ETH)
    uint256 public constant MAX_FUNDING_GOAL = 10 ether;

    /// @dev Minimum proposal duration (1 day)
    uint256 public constant MIN_DURATION = 1 days;

    /// @dev Maximum proposal duration (90 days)
    uint256 public constant MAX_DURATION = 90 days;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        string hypothesisId,
        address indexed researcher,
        uint256 fundingGoal,
        uint256 deadline
    );

    event ProposalFunded(
        uint256 indexed proposalId,
        address indexed funder,
        uint256 amount,
        uint256 currentFunding
    );

    event FundingGoalReached(
        uint256 indexed proposalId,
        uint256 totalFunding
    );

    event ResearchCompleted(
        uint256 indexed proposalId,
        string resultsHash
    );

    event ProposalRefunded(
        uint256 indexed proposalId,
        address indexed funder,
        uint256 amount
    );

    /**
     * @dev Constructor mints initial supply to deployer
     * Initial supply: 1,000,000 SCIDAO tokens
     */
    constructor() ERC20("ScienceDAO Token", "SCIDAO") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Create a new research proposal
     * @param hypothesisId Unique identifier for the hypothesis
     * @param fundingGoal Amount of funding needed (in wei)
     * @param duration How long the proposal stays open (in seconds)
     * @return proposalId The ID of the created proposal
     */
    function createProposal(
        string memory hypothesisId,
        uint256 fundingGoal,
        uint256 duration
    ) external returns (uint256) {
        require(bytes(hypothesisId).length > 0, "Hypothesis ID required");
        require(fundingGoal >= MIN_FUNDING_GOAL, "Funding goal too low");
        require(fundingGoal <= MAX_FUNDING_GOAL, "Funding goal too high");
        require(duration >= MIN_DURATION, "Duration too short");
        require(duration <= MAX_DURATION, "Duration too long");

        uint256 proposalId = proposalCount++;
        uint256 deadline = block.timestamp + duration;

        proposals[proposalId] = ResearchProposal({
            hypothesisId: hypothesisId,
            researcher: msg.sender,
            fundingGoal: fundingGoal,
            currentFunding: 0,
            deadline: deadline,
            funded: false,
            completed: false,
            resultsHash: "",
            createdAt: block.timestamp
        });

        emit ProposalCreated(proposalId, hypothesisId, msg.sender, fundingGoal, deadline);
        return proposalId;
    }

    /**
     * @dev Fund a research proposal
     * @param proposalId ID of the proposal to fund
     * @param amount Amount of tokens to contribute
     */
    function fundProposal(uint256 proposalId, uint256 amount) external {
        require(proposalId < proposalCount, "Invalid proposal ID");
        require(amount > 0, "Amount must be positive");

        ResearchProposal storage proposal = proposals[proposalId];

        require(!proposal.funded, "Proposal already funded");
        require(block.timestamp < proposal.deadline, "Proposal deadline passed");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        proposal.currentFunding += amount;

        emit ProposalFunded(proposalId, msg.sender, amount, proposal.currentFunding);

        // Check if funding goal reached
        if (proposal.currentFunding >= proposal.fundingGoal) {
            proposal.funded = true;

            // Transfer funds to researcher
            _transfer(address(this), proposal.researcher, proposal.currentFunding);

            emit FundingGoalReached(proposalId, proposal.currentFunding);
        }
    }

    /**
     * @dev Mark research as completed and store results
     * @param proposalId ID of the proposal
     * @param resultsHash IPFS hash of research results
     */
    function completeResearch(uint256 proposalId, string memory resultsHash) external {
        require(proposalId < proposalCount, "Invalid proposal ID");

        ResearchProposal storage proposal = proposals[proposalId];

        require(msg.sender == proposal.researcher, "Only researcher can complete");
        require(proposal.funded, "Proposal not funded");
        require(!proposal.completed, "Research already completed");
        require(bytes(resultsHash).length > 0, "Results hash required");

        proposal.completed = true;
        proposal.resultsHash = resultsHash;

        emit ResearchCompleted(proposalId, resultsHash);
    }

    /**
     * @dev Get proposal details
     * @param proposalId ID of the proposal
     * @return Proposal struct containing all details
     */
    function getProposal(uint256 proposalId) external view returns (ResearchProposal memory) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        return proposals[proposalId];
    }

    /**
     * @dev Check if proposal is active (not funded and deadline not passed)
     * @param proposalId ID of the proposal
     * @return bool True if proposal is active
     */
    function isProposalActive(uint256 proposalId) external view returns (bool) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        ResearchProposal storage proposal = proposals[proposalId];
        return !proposal.funded && block.timestamp < proposal.deadline;
    }

    /**
     * @dev Get funding progress percentage
     * @param proposalId ID of the proposal
     * @return uint256 Funding percentage (0-100)
     */
    function getFundingProgress(uint256 proposalId) external view returns (uint256) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        ResearchProposal storage proposal = proposals[proposalId];

        if (proposal.fundingGoal == 0) return 0;

        uint256 progress = (proposal.currentFunding * 100) / proposal.fundingGoal;
        return progress > 100 ? 100 : progress;
    }

    /**
     * @dev Get all proposals (paginated)
     * @param offset Starting index
     * @param limit Number of proposals to return
     * @return ResearchProposal[] Array of proposals
     */
    function getProposals(uint256 offset, uint256 limit)
        external
        view
        returns (ResearchProposal[] memory)
    {
        require(offset < proposalCount, "Offset out of bounds");

        uint256 end = offset + limit;
        if (end > proposalCount) {
            end = proposalCount;
        }

        uint256 resultLength = end - offset;
        ResearchProposal[] memory result = new ResearchProposal[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = proposals[offset + i];
        }

        return result;
    }

    /**
     * @dev Mint additional tokens (only owner)
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
