🔬 ScienceDAO - Autonomous Research Agents
Complete Hackathon Build Plan & Specification
Track: Research/DeSci
Duration: 14 days
Tech Stack: GAME SDK, ACP, Base L2, arXiv API, OpenAI GPT-4
Target Prize: $50,000 First Place

📋 Table of Contents

Project Overview
Architecture
File Structure
Component Specifications
Day-by-Day Build Plan
API Specifications
Smart Contract Specifications
Testing Strategy
Deployment Guide
Submission Checklist

Project Overview
What We're Building
An autonomous AI agent system that conducts scientific research without human intervention:
Core Features:

📚 Autonomous Literature Review - Scans arXiv/PubMed 24/7 for latest papers
🔍 Gap Analysis - AI identifies what hasn't been studied yet
💡 Hypothesis Generation - Creates novel, testable research ideas
🤝 Multi-Agent Collaboration - Agents coordinate via ACP (peer review, data curation)
💰 Tokenized Funding - Community funds promising research on-chain
📊 Transparent Research - All activity logged and publicly verifiable

Why This Wins
Innovation (20%)

First DeSci autonomous research agent in Virtuals ecosystem
Novel multi-agent coordination for science
Solves real "Valley of Death" funding problem

Impact (20%)

DeSci market: $500M+ in 2025
Accelerates scientific discovery by 10-100x
Democratizes research funding

Technical Excellence (45%)

3+ autonomous agents with complex workflows
ACP multi-agent coordination
Real-time arXiv API integration
On-chain smart contracts
Advanced AI prompt engineering

Demo (15%)

Live working system generating real hypotheses
Visual dashboard showing agent activity
Clear value proposition

Architecture
System Overview
┌─────────────────────────────────────────────────────────────┐
│ ScienceDAO System │
└─────────────────────────────────────────────────────────────┘
│
┌───────────────────┼───────────────────┐
│ │ │
▼ ▼ ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Research │ │ Data │ │ Peer Review │
│ Agent │◄──►│ Curator │◄──►│ Agent │
│ (Main AI) │ │ Agent │ │ │
└──────┬───────┘ └──────────────┘ └──────────────┘
│  
 │ ┌────────────────┐  
 └────────────────►│ ACP │  
 │ Coordinator │  
 └────────┬───────┘  
 │  
 ┌────────▼────────┐  
 │ Smart Contracts│  
 │ (Base L2) │  
 └────────┬────────┘  
 │  
 ┌────────▼────────┐  
 │ Dashboard UI │  
 │ (React + API) │  
 └─────────────────┘

```

### Data Flow Diagram
```

1. Research Agent → arXiv API → Fetch Papers
   ↓
2. Research Agent → Analyze Papers → Identify Gaps
   ↓
3. Research Agent → Generate Hypotheses
   ↓
4. ACP Coordinator → Send to Peer Review Agent
   ↓
5. Peer Review Agent → Validate & Score → Return Result
   ↓
6. ACP Coordinator → Send to Data Curator
   ↓
7. Data Curator → Find Datasets → Return Data
   ↓
8. Research Agent → Create On-Chain Proposal
   ↓
9. Smart Contract → Store Proposal → Emit Event
   ↓
10. Dashboard → Display to Community

```

### Technology Stack

**Backend:**
- Node.js / TypeScript
- GAME SDK (@virtuals-protocol/game)
- ACP SDK (@virtuals-protocol/acp-node)
- Ethers.js v6
- Axios for API calls
- xml2js for arXiv parsing

**Smart Contracts:**
- Solidity 0.8.20
- OpenZeppelin Contracts
- Hardhat (or Remix for quick deployment)
- Base Sepolia Testnet

**Frontend:**
- React 18
- Recharts for visualizations
- TailwindCSS for styling
- Ethers.js for wallet connection

**External APIs:**
- arXiv API (no key needed)
- OpenAI GPT-4 API
- Base RPC (Alchemy/Infura)

---

## File Structure
```

sciencedao-agent/
├── src/
│ ├── agents/
│ │ ├── scienceAgent.ts # Main research agent
│ │ ├── dataCuratorAgent.ts # Dataset finder agent
│ │ └── peerReviewAgent.ts # Hypothesis reviewer agent
│ │
│ ├── workers/
│ │ ├── researchWorker.ts # Research functions worker
│ │ ├── dataCurationWorker.ts # Data curation worker
│ │ └── reviewWorker.ts # Review functions worker
│ │
│ ├── functions/
│ │ ├── fetchPapers.ts # arXiv paper fetcher
│ │ ├── analyzePaper.ts # Paper analysis with GPT-4
│ │ ├── generateHypothesis.ts # Hypothesis generator
│ │ ├── findDatasets.ts # Dataset finder
│ │ ├── reviewHypothesis.ts # Peer review function
│ │ └── createProposal.ts # On-chain proposal creator
│ │
│ ├── acp/
│ │ ├── coordinator.ts # ACP multi-agent coordinator
│ │ └── types.ts # ACP type definitions
│ │
│ ├── contracts/
│ │ └── interactions.ts # Smart contract interactions
│ │
│ ├── utils/
│ │ ├── logger.ts # Research activity logger
│ │ ├── config.ts # Configuration manager
│ │ └── helpers.ts # Helper functions
│ │
│ └── index.ts # Main entry point
│
├── contracts/
│ ├── ResearchToken.sol # ERC20 research token
│ ├── FundingProposal.sol # Funding proposal contract
│ └── ResearchDAO.sol # DAO governance contract
│
├── scripts/
│ ├── deploy.ts # Contract deployment script
│ └── verify.ts # Contract verification script
│
├── demo/
│ └── run_demo.ts # Demo script for presentation
│
├── api/
│ ├── server.ts # Express API server
│ └── routes.ts # API routes
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Dashboard.tsx # Main dashboard
│ │ │ ├── HypothesisList.tsx # Hypothesis display
│ │ │ ├── PaperList.tsx # Papers list
│ │ │ └── StatsCards.tsx # Statistics cards
│ │ ├── App.tsx
│ │ └── index.tsx
│ └── package.json
│
├── data/
│ └── research_log.json # Agent activity logs
│
├── config/
│ └── contract.json # Deployed contract addresses
│
├── docs/
│ ├── ARCHITECTURE.md # Architecture documentation
│ ├── API.md # API documentation
│ └── SETUP.md # Setup instructions
│
├── .env # Environment variables (DO NOT COMMIT)
├── .env.example # Example environment file
├── .gitignore
├── package.json
├── tsconfig.json
├── hardhat.config.ts
└── README.md

Component Specifications

1. Research Agent (Main AI Agent)
   Purpose: Core autonomous research agent that orchestrates the entire research pipeline
   Configuration:

Name: "Dr. ScienceDAO"
Goal: "Autonomously conduct scientific research in [field], identify gaps, generate hypotheses"
Personality: Rigorous, curious, systematic, innovative
Workers: [researchWorker]

Agent State:
typescript{
current_field: string, // e.g., "longevity"
papers_analyzed: number, // Count of papers analyzed
hypotheses_generated: number, // Count of hypotheses created
research_gaps_identified: number,
last_update: string, // ISO timestamp
active_hypotheses: string[] // Array of hypothesis IDs
}
Decision Flow:

Check if new papers available (every hour)
If yes → Fetch papers on current field
Analyze each paper for findings & gaps
Aggregate gaps across multiple papers
Generate 2-3 novel hypotheses
Send best hypothesis to peer review (via ACP)
If approved → Create on-chain funding proposal
Log all activity
Wait 1 hour, repeat

2. Data Curator Agent
   Purpose: Finds and validates datasets relevant to research hypotheses
   Configuration:

Name: "Data Curator"
Goal: "Find, validate, and curate scientific datasets for research hypotheses"
Workers: [dataCurationWorker]

Functions:

Search Kaggle, UCI ML Repository, PubMed Central
Validate dataset quality and relevance
Return structured dataset metadata

ACP Integration:

Receives job requests from Research Agent
Returns dataset information
Receives payment in VIRTUAL tokens

3. Peer Review Agent
   Purpose: Evaluates hypotheses for scientific validity and feasibility
   Configuration:

Name: "Peer Reviewer"
Goal: "Critically evaluate research hypotheses for validity, novelty, feasibility"
Workers: [reviewWorker]

Evaluation Criteria:

Novelty (1-10): Is this hypothesis truly new?
Feasibility (1-10): Can this be tested with current technology?
Impact (1-10): Would success significantly advance the field?
Rigor (1-10): Is the methodology sound?
Overall Score: Average of above

Output Format:
typescript{
hypothesis_id: string,
novelty_score: number,
feasibility_score: number,
impact_score: number,
rigor_score: number,
overall_score: number,
approved: boolean, // true if overall_score >= 7
feedback: string,
reviewer_confidence: number
}

Day-by-Day Build Plan
Day 1: Setup & Foundation (6-8 hours)
Morning (3 hours):

Create project directory structure
Initialize npm project
Install all dependencies
Create .env file with API keys
Set up TypeScript configuration
Create .gitignore

Afternoon (3 hours):

Create config.ts utility
Create logger.ts utility
Test GAME SDK connection
Test OpenAI API connection
Read GAME SDK documentation
Clone and study example projects

Evening (2 hours):

Design architecture diagram
Write down data flow
Plan function specifications
Create README.md outline

Deliverables:

Working development environment
All API keys configured
Basic utilities created
Architecture documented

Day 2: Paper Fetcher & Analyzer (8 hours)
Morning (4 hours):

Create fetchPapers.ts function

Integrate with arXiv API
Parse XML responses
Handle errors and timeouts
Test with different topics

Test fetching papers on "longevity", "aging", "senescence"

Afternoon (4 hours):

Create analyzePaper.ts function

Integrate OpenAI GPT-4 API
Design analysis prompt
Parse structured responses
Extract findings, methodology, gaps

Test analysis on sample papers
Verify JSON parsing works correctly

Deliverables:

Working paper fetcher function
Working paper analyzer function
Test data saved to logs
Functions handle errors gracefully

Testing Commands:
bash# Test paper fetching
npm run test:fetch

# Test paper analysis

npm run test:analyze

```

---

### **Day 3: Hypothesis Generator & Research Worker (8 hours)**

**Morning (4 hours):**
- [ ] Create `generateHypothesis.ts` function
  - Design hypothesis generation prompt
  - Ensure specificity and testability
  - Include novelty & feasibility scoring
  - Format output as structured JSON
- [ ] Test hypothesis generation with sample gaps

**Afternoon (4 hours):**
- [ ] Create `researchWorker.ts`
  - Add all three functions
  - Configure environment
  - Test worker independently
- [ ] Create `scienceAgent.ts`
  - Configure agent personality
  - Set up state management
  - Connect to research worker
  - Initialize agent

**Evening (Optional):**
- [ ] Run agent for first time
- [ ] Debug initialization issues
- [ ] Verify agent can call functions

**Deliverables:**
- Complete research worker
- Main science agent configured
- Agent can run autonomously
- Logs capture all activity

---

### **Day 4: Testing & Refinement (8 hours)**

**Morning (3 hours):**
- [ ] Create `index.ts` entry point
- [ ] Run agent continuously for 1 hour
- [ ] Monitor logs and debug issues
- [ ] Fix API rate limit problems
- [ ] Improve error handling

**Afternoon (3 hours):**
- [ ] Optimize prompts for better results
- [ ] Test with multiple research fields
- [ ] Validate hypothesis quality
- [ ] Improve JSON parsing reliability
- [ ] Add retry logic for failed API calls

**Evening (2 hours):**
- [ ] Create helper utilities
- [ ] Add better logging
- [ ] Document all functions
- [ ] Write usage examples

**Deliverables:**
- Stable agent that runs for hours
- High-quality hypotheses generated
- Comprehensive logs
- All bugs fixed

---

### **Day 5: Smart Contracts (8 hours)**

**Morning (4 hours):**
- [ ] Create `ResearchToken.sol`
  - ERC20 token for governance
  - Minting function
  - Transfer functions
- [ ] Create `FundingProposal.sol`
  - Create proposal function
  - Fund proposal function
  - Complete research function
  - Event emissions

**Afternoon (4 hours):**
- [ ] Set up Hardhat or use Remix
- [ ] Deploy to Base Sepolia testnet
- [ ] Verify contracts on BaseScan
- [ ] Get testnet ETH from faucet
- [ ] Test contract functions manually

**Evening:**
- [ ] Create `createProposal.ts` function
- [ ] Test creating proposal from agent
- [ ] Save contract addresses to config

**Deliverables:**
- Deployed and verified contracts
- Contract addresses documented
- Agent can create proposals on-chain
- All transactions visible on BaseScan

**Contract Addresses to Save:**
```

RESEARCH_TOKEN_ADDRESS=0x...
FUNDING_PROPOSAL_ADDRESS=0x...

Day 6-7: Multi-Agent System (ACP) (12-16 hours)
Day 6 Morning (4 hours):

Install ACP SDK
Study ACP documentation
Create dataCuratorAgent.ts
Create dataCurationWorker.ts
Create findDatasets.ts function

Day 6 Afternoon (4 hours):

Create peerReviewAgent.ts
Create reviewWorker.ts
Create reviewHypothesis.ts function
Test each agent independently

Day 7 Morning (4 hours):

Create coordinator.ts for ACP
Implement job creation
Implement job fulfillment
Test agent-to-agent communication

Day 7 Afternoon (4 hours):

Integrate ACP into research agent
Test full workflow:

Research Agent → Generates hypothesis
Coordinator → Sends to Peer Review
Peer Review → Returns score
Coordinator → Sends to Data Curator
Data Curator → Returns datasets
Research Agent → Creates proposal

Debug coordination issues
Optimize communication flow

Deliverables:

3 agents working together
ACP coordinator managing jobs
Full research pipeline automated
All agents logging activity

Day 8: Frontend Dashboard (8 hours)
Morning (4 hours):

Create React app in frontend/
Install dependencies (recharts, axios)
Create API server in api/server.ts
Create API endpoints:

GET /api/status → Agent stats
GET /api/hypotheses → Recent hypotheses
GET /api/papers → Analyzed papers
GET /api/proposals → Funding proposals

Afternoon (4 hours):

Create Dashboard.tsx component
Create HypothesisList.tsx
Create StatsCards.tsx
Add styling with Tailwind
Connect to API
Test live updates

Deliverables:

Live dashboard showing agent activity
Real-time statistics
Hypothesis list with details
API server running

Dashboard Features:

Total papers analyzed
Total hypotheses generated
Active funding proposals
Recent activity feed
Hypothesis cards with "Fund" buttons

Day 9: Demo Scenario (6-8 hours)
Morning (3 hours):

Create demo/run_demo.ts
Script the perfect demo flow:

Fetch papers announcement
Analysis in progress
Gaps identified
Hypothesis generated
Peer review
Proposal created

Add delays for dramatic effect
Add console colors and formatting

Afternoon (3 hours):

Record screen demo video

Show terminal with agent running
Show dashboard updating live
Show contract on BaseScan
Show logs file

Narrate what's happening
Edit video to 3-5 minutes
Add title cards and transitions

Evening (2 hours):

Test end-to-end one more time
Fix any issues found
Optimize performance
Prepare backup demo

Deliverables:

Polished demo script
3-5 minute video demo
Backup demo ready
All systems tested

Day 10: Documentation (6 hours)
Create:

README.md (comprehensive)
ARCHITECTURE.md
SETUP.md (installation guide)
API.md (API documentation)
Add code comments
Add inline documentation
Create architecture diagram (draw.io)
Screenshot dashboard
Screenshot contract on BaseScan

README.md Structure:
markdown# ScienceDAO

## Overview

[Brief description]

## Features

[Bullet points]

## Architecture

[Diagram]

## Installation

[Step-by-step]

## Usage

[Examples]

## Demo

[Video link]

## Technical Stack

[Technologies used]

## Future Roadmap

[Next steps]

## Team

[Your info]

```

---

### **Day 11-12: Polish & Testing (12 hours)**

**Day 11:**
- [ ] Test all functions thoroughly
- [ ] Fix edge cases
- [ ] Improve error messages
- [ ] Add loading states to UI
- [ ] Optimize API calls
- [ ] Test with bad inputs
- [ ] Test with API failures
- [ ] Test with no internet

**Day 12:**
- [ ] UI polish (styling)
- [ ] Mobile responsive design
- [ ] Better color scheme
- [ ] Loading animations
- [ ] Error handling in UI
- [ ] Performance optimization
- [ ] Code cleanup
- [ ] Remove console.logs

**Deliverables:**
- Production-ready code
- All bugs fixed
- Beautiful UI
- Fast performance

---

### **Day 13: Pitch Deck (4-6 hours)**

Create 5-slide PowerPoint/Google Slides:

**Slide 1: Problem**
- Research funding is broken
- "Valley of Death" - 18+ months for grants
- Only 20% of research gets funded
- Slows scientific progress

**Slide 2: Solution**
- AI agents conducting research 24/7
- Autonomous hypothesis generation
- Community-driven funding
- Research in days, not years

**Slide 3: How It Works**
- [Architecture diagram]
- 3 specialized agents
- ACP coordination
- On-chain transparency

**Slide 4: Results & Demo**
- [Screenshots]
- X papers analyzed
- Y hypotheses generated
- Z funded proposals
- [Key metrics]

**Slide 5: Market & Future**
- DeSci market: $500M+ (2025)
- First mover in Virtuals
- Partnerships: Bio Protocol, VitaDAO
- Roadmap: Lab integration, DAO governance

**Design Tips:**
- Use dark theme
- Minimal text
- Big numbers
- Professional graphics
- Consistent fonts

---

### **Day 14: Final Submission (4 hours)**

**Morning (2 hours):**
- [ ] Push code to GitHub
- [ ] Clean commit history
- [ ] Add LICENSE (MIT)
- [ ] Verify README renders correctly
- [ ] Check all links work
- [ ] Deploy dashboard to Vercel
- [ ] Upload video to YouTube
- [ ] Export pitch deck as PDF

**Afternoon (2 hours):**
- [ ] Fill out submission form
- [ ] Double-check all requirements:
  - ✅ GitHub repo link
  - ✅ Live demo link
  - ✅ Video demo link
  - ✅ Pitch deck PDF
  - ✅ Contract addresses
  - ✅ Team information
- [ ] Test all links one more time
- [ ] Submit before deadline
- [ ] Take screenshots of submission
- [ ] Celebrate! 🎉

---

## API Specifications

### arXiv API

**Endpoint:** `http://export.arxiv.org/api/query`

**Query Parameters:**
- `search_query`: Search term (e.g., "all:longevity")
- `start`: Starting index (default: 0)
- `max_results`: Max papers to return (max: 50)
- `sortBy`: submittedDate, relevance, lastUpdatedDate
- `sortOrder`: ascending or descending

**Response Format:** XML (Atom feed)

**Example Request:**
```

http://export.arxiv.org/api/query?search_query=all:longevity&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending
Response Structure:
xml<feed>
<entry>
<id>http://arxiv.org/abs/2301.12345</id>
<title>Title of Paper</title>
<author><name>Author Name</name></author>
<published>2023-01-15T00:00:00Z</published>
<summary>Abstract text...</summary>
<category term="q-bio.NC" />
</entry>
</feed>
Rate Limits:

1 request per 3 seconds
Implement delays between calls

OpenAI API
Endpoint: https://api.openai.com/v1/chat/completions
Request Format:
json{
"model": "gpt-4",
"messages": [
{
"role": "system",
"content": "You are a research analyst..."
},
{
"role": "user",
"content": "Analyze this paper..."
}
],
"temperature": 0.3,
"max_tokens": 1000
}

```

**Headers:**
```

Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
Temperature Settings:

Paper analysis: 0.3 (more factual)
Hypothesis generation: 0.7 (more creative)
Peer review: 0.4 (balanced)

Internal API Endpoints
Create Express server with following endpoints:
GET /api/status
json{
"agent_status": "active",
"uptime": 123456,
"papers_analyzed": 45,
"hypotheses_generated": 12,
"proposals_created": 3
}
GET /api/hypotheses
json{
"hypotheses": [
{
"id": "hyp_123",
"hypothesis": "If X, then Y because Z",
"field": "longevity",
"novelty_score": 8,
"feasibility_score": 7,
"generated_at": "2025-10-15T10:30:00Z"
}
]
}
GET /api/papers
json{
"papers": [
{
"title": "Paper Title",
"authors": "Author Names",
"published": "2025-10-01",
"analyzed_at": "2025-10-15T09:00:00Z"
}
]
}
GET /api/proposals
json{
"proposals": [
{
"id": 1,
"hypothesis_id": "hyp_123",
"funding_goal": "0.1 ETH",
"current_funding": "0.05 ETH",
"deadline": "2025-11-15T00:00:00Z",
"tx_hash": "0x..."
}
]
}

Smart Contract Specifications
ResearchToken.sol
Purpose: ERC20 governance token for ScienceDAO
Functions:

constructor() - Mint initial supply to deployer
createProposal(hypothesis, goal, duration) - Create research proposal
fundProposal(proposalId, amount) - Fund a proposal
completeResearch(proposalId, resultsHash) - Mark research complete

Events:

ProposalCreated(proposalId, hypothesisId, fundingGoal)
ProposalFunded(proposalId, funder, amount)
ResearchCompleted(proposalId, resultsHash)

State Variables:
soliditystruct ResearchProposal {
string hypothesisId;
address researcher;
uint256 fundingGoal;
uint256 currentFunding;
uint256 deadline;
bool funded;
bool completed;
string resultsHash;
}

mapping(uint256 => ResearchProposal) public proposals;
uint256 public proposalCount;
Key Logic:

When proposal reaches funding goal → Transfer funds to researcher
Lock liquidity pool for 10 years
Burn tokens periodically (buyback-and-burn)

Testing Strategy
Unit Tests
Functions to Test:

fetchPapers() - Mock arXiv API responses
analyzePaper() - Mock OpenAI responses
generateHypothesis() - Verify output format
createProposal() - Mock contract interaction

Integration Tests
Workflows to Test:

Full research cycle (fetch → analyze → generate → propose)
Multi-agent coordination (research → review → curate)
On-chain proposal creation
API endpoints returning correct data

Manual Testing Checklist

Agent runs for 1+ hour without crashing
Hypotheses are scientifically sound
Dashboard updates in real-time
Contract transactions succeed
Logs capture all activity
Error handling works correctly
Rate limits respected
Memory usage stable

Deployment Guide

1. Deploy Smart Contracts
   Using Remix IDE:

Go to remix.ethereum.org
Create new file ResearchToken.sol
Paste contract code
Compile with Solidity 0.8.20
Connect MetaMask to Base Sepolia
Deploy contract
Copy contract address
Verify on BaseScan

Using Hardhat:
bashnpx hardhat compile
npx hardhat run scripts/deploy.ts --network baseSepolia
npx hardhat verify --network baseSepolia DEPLOYED_ADDRESS 2. Deploy API Server
Using Vercel:
bashcd api
vercel deploy
Using Railway:
bashcd api
railway up 3. Deploy Frontend
Using Vercel:
bashcd frontend
npm run build
vercel deploy --prod 4. Run Agent
Local:
bashnpm run build
npm start
Cloud (PM2):
bashnpm install -g pm2
pm2 start dist/index.js --name sciencedao-agent
pm2 save

Submission Checklist
Code Repository

All code pushed to GitHub
README.md complete with:

Project description
Features list
Architecture diagram
Installation instructions
Usage examples
Demo video link
Tech stack
Team info

.env.example provided
.gitignore includes .env
LICENSE file (MIT)
Code is well-commented
No sensitive data committed

Live Demo

Dashboard deployed and accessible
API server running
Agent running continuously
Smart contracts deployed
Contracts verified on BaseScan
All links tested and working

Video Demo

3-5 minutes long
Shows problem statement
Shows solution overview
Live demo walkthrough
Technical highlights
Impact & future plans
Uploaded to YouTube
Good audio quality
Clear visuals

Pitch Deck

Exactly 5 slides
PDF format
Professional design
Covers: Problem, Solution, How It Works, Results, Market
Includes architecture diagram
Includes key metrics
Readable fonts
High-quality graphics

Submission Form

Project name: "ScienceDAO - Autonomous Research Agents"
Track: Research/DeSci
GitHub URL
Live demo URL
Video demo URL
Pitch deck PDF
Contract addresses
Team information
Short description (100 words)
All fields completed

Resources & Links
Documentation

GAME SDK Docs: https://docs.game.virtuals.io/
GAME Python GitHub: https://github.com/game-by-virtuals/game-python
GAME Node GitHub: https://github.com/game-by-virtuals/game-node
ACP Builder Guide: https://whitepaper.virtuals.io/info-hub/builders-hub/agent-commerce-protocol-acp-builder-guide
Virtuals Whitepaper: https://whitepaper.virtuals.io/
Base Docs: https://docs.base.org/

APIs

GAME Console: https://console.game.virtuals.io/
arXiv API: http://export.arxiv.org/api_help
OpenAI API: https://platform.openai.com/docs
Base Sepolia Faucet: https://www.alchemy.com/faucets/base-sepolia
Alchemy Dashboard: https://dashboard.alchemy.com/

Communities

Virtuals Discord: https://discord.gg/virtualsio
Hackathon Telegram: https://t.me/virtualsethhackathon
Virtuals Twitter: https://twitter.com/virtuals_io

Tools

Remix IDE: https://remix.ethereum.org
BaseScan: https://sepolia.basescan.org
Vercel: https://vercel.com
Excalidraw: https://excalidraw.com (for diagrams)

Success Metrics
Minimum Viable Product (MVP):

✅ Single agent fetches papers
✅ Agent generates 1 hypothesis
✅ Simple dashboard
✅ Contract deployed
✅ 3-min demo video

Full Product:

✅ 3 agents coordinating via ACP
✅ 10+ hypotheses generated
✅ Live dashboard with stats
✅ Smart contracts on Base
✅ Professional pitch deck
✅ 5-min demo video
✅ Complete documentation

Stretch Goals:

⭐ Integration with Bio Protocol
⭐ Real dataset curation
⭐ DAO governance
⭐ Mobile-responsive UI
⭐ Real community funding

Budget
Required:

OpenAI API: $10-20 (for testing)
Base testnet ETH: FREE (faucet)
GAME SDK: FREE (subsidized)

Optional:

Domain name: $10/year
Vercel Pro: FREE tier sufficient
Cloud hosting: $20/month (optional)

Total Minimum: $10-20

Final Notes
Time Management
Critical Path:

Days 1-4: Core agent working
Days 5-7: Multi-agent + contracts
Days 8-9: Demo ready
Days 10-14: Polish + submit

If Behind Schedule:

Skip Data Curator agent
Use Remix instead of Hardhat
Simple dashboard styling
Focus on demo quality

Common Pitfalls
❌ Don't:

Hardcode API keys in code
Commit .env file
Over-engineer the solution
Spend too long on UI
Wait until last day to test

✅ Do:

Test early and often
Start with MVP, add features
Ask for help in Discord
Keep code simple
Focus on demo impact

Getting Help
Stuck on GAME SDK?

Discord: #builders-chat
Check examples in GitHub
Ask DevRel team

Stuck on smart contracts?

Use Remix (simpler than Hardhat)
Copy OpenZeppelin templates
Test on testnet first

Stuck on prompts?

Test in ChatGPT first
Be very specific
Include examples
Iterate based on output

Good Luck! 🚀
You're building something that could genuinely accelerate scientific discovery. Focus on:

Working demo - Must see it in action
Clear value - Solve real problem
Technical depth - Show complexity
Professional presentation - Polish matters

Remember: Judges want to see innovation + impact + technical excellence. You have all three!
Now go build it! 💪🔬
