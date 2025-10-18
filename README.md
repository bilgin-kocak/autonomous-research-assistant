# 🔬 ScienceDAO - Autonomous Research Agents

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![GAME SDK](https://img.shields.io/badge/GAME-SDK-purple)](https://docs.game.virtuals.io/)
[![Base Network](https://img.shields.io/badge/Base-Sepolia-blue)](https://base.org/)

**A fully autonomous AI agent system that conducts scientific research, peer review, and creates on-chain funding proposals - without any human intervention.**

Built for the Virtuals Protocol hackathon, demonstrating the power of multi-agent coordination via Agent Commerce Protocol (ACP).

## 🎯 What ScienceDAO Does

ScienceDAO is a **complete autonomous research pipeline** where AI agents:

1. 📚 **Discover** - Continuously scan arXiv for latest research papers
2. 🔬 **Analyze** - Extract findings, methodologies, and research gaps using GPT-4
3. 💡 **Generate** - Create novel, testable hypotheses from identified gaps
4. 👨‍🔬 **Review** - Peer review hypotheses via multi-agent coordination (ACP)
5. 📊 **Curate** - Find relevant datasets to support research
6. ⛓️ **Deploy** - Create on-chain funding proposals on Base blockchain
7. 💰 **Fund** - Enable community funding via Web3 wallets

**All of this happens autonomously 24/7 with no human intervention.**

## ✨ Key Features

### 🔬 Autonomous Research Pipeline
- **Paper Discovery**: Continuously fetches latest research from arXiv
- **AI Analysis**: GPT-4 extracts findings, methodologies, and research gaps
- **Hypothesis Generation**: Creates novel, testable research hypotheses
- **Quality Scoring**: Multi-criteria evaluation (novelty, feasibility, impact, rigor)

### 🤝 Multi-Agent Coordination (ACP)
- **Peer Review Agent**: Independent evaluation with detailed feedback
- **Data Curator Agent**: Automated dataset discovery from multiple sources
- **Job-Based System**: ACP protocol for inter-agent communication
- **Payment Tracking**: Mock VIRTUAL token economics

### ⛓️ Blockchain Integration
- **Base Sepolia L2**: Low-cost, fast transactions
- **Smart Contracts**: On-chain proposal management
- **Privy Wallet**: Email, social, or Web3 wallet authentication
- **Transparent Funding**: Community-driven research funding

### 📊 Real-Time Dashboard
- **Live Statistics**: Agent activity, success rates, processing times
- **Hypothesis Tracking**: View all generated hypotheses with scores
- **Proposal Management**: Create and fund research proposals
- **Activity Feed**: Complete audit trail of all agent actions

### 🔒 Production Ready
- **Error Handling**: Retry logic with exponential backoff
- **Health Monitoring**: Pre-flight API checks
- **Memory Management**: Leak detection and tracking
- **Logging System**: Comprehensive activity logging to JSON
- **Rate Limiting**: Respects API constraints

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      🌐 Web Dashboard                             │
│                  (React + TypeScript + Vite)                      │
│   📊 Real-time Stats | 💡 Hypotheses | 💰 Proposals | 🔬 Papers  │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              │ REST API
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                      🚀 Express API Server                        │
│                       (TypeScript + Node)                         │
│   Routes: /status, /hypotheses, /proposals, /papers, /activity   │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              │ Reads from
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                   📝 research_log.json                            │
│              (Persistent Research Activity Log)                   │
└─────────────────────────────▲────────────────────────────────────┘
                              │
                              │ Writes to
                              │
┌─────────────────────────────┴────────────────────────────────────┐
│                    🤖 MULTI-AGENT SYSTEM                          │
│                  (GAME SDK + ACP Coordination)                    │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐      ┌──────────────────┐                  │
│  │  Research Agent │─────▶│  ACP Coordinator │                  │
│  │  (Main AI Loop) │      │  (Job Scheduler) │                  │
│  └────────┬────────┘      └────────┬─────────┘                  │
│           │                         │                             │
│           │  Publishes Jobs         │ Delegates Tasks            │
│           │                         │                             │
│           │         ┌───────────────┴──────────────┐             │
│           │         │                                │            │
│           │         ▼                                ▼            │
│           │  ┌──────────────┐              ┌─────────────────┐  │
│           └─▶│ Peer Review  │              │  Data Curator   │  │
│              │    Agent     │              │     Agent       │  │
│              │              │              │                 │  │
│              │ • Score 0-10 │              │ • Find Datasets │  │
│              │ • Evaluate   │              │ • Kaggle/UCI    │  │
│              │ • Recommend  │              │ • PubMed Data   │  │
│              └──────┬───────┘              └────────┬────────┘  │
│                     │                                │            │
│                     └────────────┬───────────────────┘            │
│                                  │                                │
│                                  │ Results                        │
│                                  │                                │
│                                  ▼                                │
│                       ┌──────────────────┐                        │
│                       │ Hypothesis Ready │                        │
│                       │  for Proposal?   │                        │
│                       └─────────┬────────┘                        │
│                                 │                                 │
│                                 │ YES (Score ≥ 7.0)               │
│                                 │                                 │
└─────────────────────────────────┼─────────────────────────────────┘
                                  │
                                  │ Creates Proposal
                                  │
┌─────────────────────────────────▼─────────────────────────────────┐
│                  ⛓️  BASE BLOCKCHAIN (L2)                         │
│                     ResearchToken.sol                             │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📝 createProposal(hypothesisId, fundingGoal, duration)          │
│  💰 fundProposal(proposalId, amount)                             │
│  📊 getProposal(proposalId) → Proposal details                   │
│                                                                   │
│  🔐 Deployed on Base Sepolia Testnet                             │
│  🌐 Contract: 0x1221aBCe7D8FB1ba4cF9293E94539cb45e7857fE         │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
                                  ▲
                                  │
                                  │ User Wallets (Privy)
                                  │
┌─────────────────────────────────┴─────────────────────────────────┐
│                     👤 Community Users                            │
│                                                                   │
│  • Connect wallet (email, social, or Web3 wallet)                │
│  • Create on-chain proposals from approved hypotheses            │
│  • Fund research proposals with ETH                              │
│  • Track funding progress in real-time                           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘


🔄 External Services:
  • arXiv API → Paper Discovery
  • OpenAI GPT-4 → Analysis & Hypothesis Generation
  • Kaggle/UCI/PubMed → Dataset Discovery
```

## 📦 Complete Tech Stack

### Backend & Agent System
- **Language:** TypeScript 5.3, Node.js 18+
- **AI Framework:** GAME SDK (@virtuals-protocol/game)
- **Multi-Agent:** Agent Commerce Protocol (ACP)
- **AI Models:** OpenAI GPT-4 (paper analysis, hypothesis generation, peer review)

### Frontend Dashboard
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS
- **Wallet Auth:** Privy (email, social, Web3 wallets)
- **Blockchain:** ethers.js v6, viem

### Blockchain
- **Network:** Base Sepolia (L2 Testnet)
- **Contract:** ResearchToken.sol (proposal management)
- **Tools:** Hardhat, Solidity

### API & Data
- **API Server:** Express + TypeScript
- **Data Storage:** research_log.json (persistent logging)
- **External APIs:** arXiv, OpenAI, Kaggle, UCI ML Repository

### Development Tools
- **Package Manager:** npm
- **Testing:** Custom test suite
- **Environment:** dotenv
- **Build:** TypeScript compiler (tsc)

## 🚀 Quick Start Guide

### Prerequisites

- Node.js v18+ (v18.18.2 tested)
- npm v9+
- OpenAI API key ([Get here](https://platform.openai.com/api-keys))
- GAME API key ([Get here](https://console.game.virtuals.io/))
- Base Sepolia ETH ([Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/sciencedao-agent.git
cd sciencedao-agent
```

#### 2. Install backend dependencies
```bash
npm install
```

#### 3. Install API server dependencies
```bash
cd api
npm install
cd ..
```

#### 4. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

#### 5. Configure environment variables

**Backend (.env in root):**
```bash
cp .env.example .env
```

Edit `.env` and add:
```env
# Required
GAME_API_KEY=your_game_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional (with defaults)
DEFAULT_RESEARCH_FIELD=machine learning
MAX_PAPERS_PER_FETCH=5
ARXIV_RATE_LIMIT_SECONDS=3

# Blockchain (optional, defaults provided)
PRIVATE_KEY=your_wallet_private_key_for_deployments
BASE_SEPOLIA_RPC=https://sepolia.base.org
CONTRACT_ADDRESS=0x1221aBCe7D8FB1ba4cF9293E94539cb45e7857fE
```

**Frontend (.env in frontend/):**
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` and add:
```env
VITE_API_URL=http://localhost:3001/api
VITE_CONTRACT_ADDRESS=0x1221aBCe7D8FB1ba4cF9293E94539cb45e7857fE
VITE_PRIVY_APP_ID=your_privy_app_id
```

### Running the Complete System

#### Terminal 1: Run the Agent
```bash
npm start
```

#### Terminal 2: Run the API Server
```bash
cd api
npm run dev
```

#### Terminal 3: Run the Frontend Dashboard
```bash
cd frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser!

## 🎬 Demo: See It In Action

### Run the Full Autonomous Workflow Demo

The demo script runs the **complete** research pipeline in 2-5 minutes:

```bash
cd demo
npx ts-node run_demo.ts
```

**What the demo does:**
1. ✅ Fetches 3 real papers from arXiv on "longevity"
2. ✅ Analyzes each paper with GPT-4
3. ✅ Generates novel hypotheses from research gaps
4. ✅ Sends hypothesis to Peer Review Agent (ACP)
5. ✅ Sends hypothesis to Data Curator Agent (ACP)
6. ✅ Creates on-chain proposal if approved
7. ✅ Logs everything to `research_log.json`

**Example output:**
```
╔═══════════════════════════════════════════════════════════════╗
║       🔬 ScienceDAO FULL AUTONOMOUS WORKFLOW DEMO 🔬         ║
║    Papers → Analysis → Hypothesis → Review → Datasets        ║
╚═══════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════
📚 STEP 1: FETCHING PAPERS FROM ARXIV
═══════════════════════════════════════════════════════════════
✅ Fetched 3 papers in 4.2s

═══════════════════════════════════════════════════════════════
🔬 STEP 2: ANALYZING PAPERS WITH GPT-4
═══════════════════════════════════════════════════════════════
📄 Analyzing paper 1/3...
   ✅ Analyzed in 2.1s - Found 4 gaps

═══════════════════════════════════════════════════════════════
💡 STEP 3: GENERATING NOVEL HYPOTHESIS
═══════════════════════════════════════════════════════════════
✅ Generated 1 hypotheses in 3.5s

📝 Generated Hypothesis (Top Scored):
   "Integrate epigenetic clocks with multi-omics data to predict..."

═══════════════════════════════════════════════════════════════
🤖 STEP 4 & 5: MULTI-AGENT COORDINATION VIA ACP
═══════════════════════════════════════════════════════════════
✅ Multi-agent workflow completed in 45.2s

═══════════════════════════════════════════════════════════════
📊 PEER REVIEW RESULTS
═══════════════════════════════════════════════════════════════
   Overall Score: 7.8/10
   Status: ✅ APPROVED

═══════════════════════════════════════════════════════════════
📚 DATASETS FOUND
═══════════════════════════════════════════════════════════════
   Found 3 relevant datasets

╔═══════════════════════════════════════════════════════════════╗
║                ✅ FULL WORKFLOW COMPLETE! ✅                  ║
╚═══════════════════════════════════════════════════════════════╝

💰 Proposal created on-chain: YES
```

### View Results in Dashboard

After running the demo:
1. Start the API server: `cd api && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Open [http://localhost:5173](http://localhost:5173)
4. See the hypothesis with peer review scores and datasets!

### Running Tests

**Test individual components:**
```bash
npm run test:fetch          # Test arXiv fetching
npm run test:analyze        # Test GPT-4 analysis
npm run test:hypothesis     # Test hypothesis generation
npm run test:agent          # Test complete research agent
npm run test:pipeline       # Test full pipeline
npm run test:longrunning    # Test 10+ min stability
npm run test:all            # Run all tests
```

**Run the autonomous agent:**
```bash
npm start                           # Single iteration
npm start:continuous                # Continuous (10 min intervals)
npm start:continuous:5min           # Continuous (5 min intervals)
npm start:debug                     # Debug mode with detailed logs
npm start -- --continuous 5         # Custom interval
npm start -- --help                 # See all options
```

## 📋 Project Progress & Roadmap

### ✅ Day 1: Setup & Foundation (COMPLETED)
- Project structure established
- Dependencies configured
- Environment setup
- GAME SDK integration

### ✅ Day 2: Paper Fetcher & Analyzer (COMPLETED)

**Completed Features:**

1. **Paper Fetcher Function** (`src/functions/fetchPapers.ts`)
   - Fetches latest papers from arXiv
   - Supports multiple research topics
   - Rate limiting (1 req/3 seconds)
   - XML parsing with error handling

2. **Paper Analyzer Function** (`src/functions/analyzePaper.ts`)
   - Analyzes papers using GPT-4
   - Extracts: findings, methodology, gaps, next steps
   - Batch processing capability
   - JSON parsing with fallbacks

3. **Utility Infrastructure**
   - `config.ts` - Configuration management
   - `logger.ts` - Activity logging with colors

4. **Comprehensive Testing**
   - Unit tests for each function
   - Integration test for full pipeline
   - Sample data and expected outputs

### ✅ Day 3: Hypothesis Generator & Research Agent (COMPLETED)

**Completed Features:**

1. **Hypothesis Generator Function** (`src/functions/generateHypothesis.ts`)
   - Generates novel, testable hypotheses from research gaps
   - Multi-criteria scoring: novelty, feasibility, impact, rigor
   - Structured JSON output with rationale and methodology
   - Temperature: 0.7 (creative but grounded)
   - Helper functions: ranking, filtering

2. **Research Worker** (`src/workers/researchWorker.ts`)
   - Coordinates all research functions
   - Environment context for agent understanding
   - Integrates: fetch → analyze → generate

3. **Science Agent** (`src/agents/scienceAgent.ts`)
   - **Dr. ScienceDAO** - Main autonomous research agent
   - State management (papers analyzed, hypotheses generated)
   - Autonomous operation with GAME SDK
   - Comprehensive personality and capabilities

4. **Main Entry Point** (`src/index.ts`)
   - Agent initialization and execution
   - Graceful shutdown handling
   - Statistics reporting

5. **Extended Test Suite**
   - `testGenerateHypothesis.ts` - Test hypothesis generation
   - `testResearchAgent.ts` - Complete end-to-end workflow
   - Full pipeline: fetch → analyze → generate

### ✅ Day 4: Testing & Refinement (COMPLETED)

**Completed Features:**

1. **Enhanced Main Entry Point** (`src/index.ts`)
   - Multiple operation modes: single, continuous, test
   - Health monitoring for OpenAI and arXiv APIs
   - Performance metrics tracking (iterations, success rate, timing, memory)
   - Automatic retry logic with exponential backoff (3 attempts)
   - Graceful shutdown with final statistics
   - Command-line argument support

2. **Enhanced Logger** (`src/utils/logger.ts`)
   - Log levels: DEBUG, INFO, WARNING, ERROR
   - API call tracking and metrics
   - Performance profiling
   - Enhanced console output with duration display
   - Metrics retrieval methods (API and performance summaries)

3. **Long-Running Test** (`tests/testLongRunning.ts`)
   - 10+ minute stability testing
   - Memory leak detection
   - API metrics tracking
   - Progress display and final assessment
   - Pass/Fail criteria: ≥90% success rate, <50MB memory growth

4. **Production-Ready Features**
   - Health checks on startup
   - Retry logic for transient failures
   - Memory usage monitoring
   - API success rate tracking
   - Continuous operation support
   - Multiple deployment modes

### 📊 Test Results

When you run the tests, you'll see:

```
============================================================
Testing arXiv Paper Fetcher
============================================================

Test 1: Fetching papers on "longevity"...
------------------------------------------------------------
✓ Successfully fetched 5 papers on "longevity"

First Paper:
  Title: [Paper Title]
  Authors: [Authors]
  Published: [Date]
  Link: [arXiv URL]
  Summary: [First 150 chars]...
```

All activity is logged to `data/research_log.json`.

## 🗂️ Project Structure

```
sciencedao-agent/
├── src/
│   ├── functions/          # GameFunction implementations
│   │   ├── fetchPapers.ts     # arXiv paper fetcher
│   │   ├── analyzePaper.ts    # GPT-4 paper analyzer
│   │   └── generateHypothesis.ts # Hypothesis generator ✅
│   ├── workers/            # Function workers
│   │   └── researchWorker.ts  # Research coordinator ✅
│   ├── agents/             # AI agents
│   │   └── scienceAgent.ts    # Dr. ScienceDAO ✅
│   ├── utils/              # Utility modules
│   │   ├── config.ts          # Configuration manager
│   │   └── logger.ts          # Activity logger
│   ├── contracts/          # Smart contract interactions
│   └── index.ts            # Main entry point ✅
├── tests/                  # Test scripts
│   ├── testFetchPapers.ts     # Paper fetcher tests
│   ├── testAnalyzePaper.ts    # Paper analyzer tests
│   ├── testGenerateHypothesis.ts # Hypothesis tests ✅
│   ├── testResearchAgent.ts   # Complete workflow ✅
│   ├── testFullPipeline.ts    # Integration tests
│   └── testLongRunning.ts     # 10+ min stability test ✅
├── data/                   # Data storage
│   └── research_log.json      # Activity logs
├── config/                 # Configuration files
│   └── contract.json          # Contract addresses
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies and scripts
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run agent (single iteration) |
| `npm start:continuous` | Run agent continuously (10 min intervals) ✨ DAY 4 |
| `npm start:continuous:5min` | Run agent continuously (5 min intervals) ✨ DAY 4 |
| `npm start:debug` | Run with debug logging ✨ DAY 4 |
| `npm run test:fetch` | Test paper fetching from arXiv |
| `npm run test:analyze` | Test paper analysis with GPT-4 |
| `npm run test:hypothesis` | Test hypothesis generation |
| `npm run test:agent` | Test complete research workflow |
| `npm run test:pipeline` | Test full pipeline |
| `npm run test:longrunning` | Test 10+ min stability ✨ DAY 4 |
| `npm run test:all` | Run all tests |
| `npm test` | Run core tests |
| `npm run clean` | Remove build artifacts |

## 📚 API Documentation

### arXiv API
- **Endpoint:** `http://export.arxiv.org/api/query`
- **Format:** XML (Atom feed)
- **Rate Limit:** 1 request per 3 seconds
- **Max Results:** 50 papers per request

### OpenAI API
- **Model:** GPT-4
- **Temperature:** 0.3 (factual analysis)
- **Max Tokens:** 1000
- **Timeout:** 30 seconds

## 🔍 Example Usage

### Fetching Papers

```typescript
import { fetchPapersWithRateLimit } from './src/functions/fetchPapers';

const papers = await fetchPapersWithRateLimit('longevity', 10);
console.log(`Found ${papers.count} papers on ${papers.topic}`);
```

### Analyzing Papers

```typescript
import { analyzePaper } from './src/functions/analyzePaper';

const analysis = await analyzePaper(
  'Deep Learning for Aging Research',
  'This paper explores...'
);

console.log('Findings:', analysis.findings);
console.log('Gaps:', analysis.gaps);
console.log('Next Steps:', analysis.next_steps);
```

## 📝 Logging

All agent activities are logged to `data/research_log.json`:

```json
{
  "timestamp": "2025-10-16T12:00:00.000Z",
  "type": "PAPER_FETCH",
  "message": "Fetched 10 papers on topic: longevity",
  "data": { "topic": "longevity", "count": 10 }
}
```

View statistics:
```typescript
import { Logger } from './src/utils/logger';

const stats = Logger.getStats();
console.log(stats);
```

## 🎯 Roadmap

### ✅ Day 1: Setup & Foundation
- Project structure
- Dependencies installed
- Environment configured

### ✅ Day 2: Paper Fetcher & Analyzer
- arXiv API integration
- OpenAI GPT-4 analysis
- Comprehensive logging
- Test suite

### ✅ Day 3: Hypothesis Generator & Research Agent
- ✅ Generate novel hypotheses
- ✅ Multi-criteria scoring system
- ✅ Research worker coordinator
- ✅ Dr. ScienceDAO autonomous agent
- ✅ Complete end-to-end workflow

### ✅ Day 4: Testing & Refinement (CURRENT)
- ✅ Enhanced main entry point with multiple operation modes
- ✅ Health monitoring and pre-flight checks
- ✅ Performance metrics tracking
- ✅ Retry logic with exponential backoff
- ✅ Enhanced logger with API and performance tracking
- ✅ 10+ minute stability test
- ✅ Memory leak detection
- ✅ Command-line configuration

### ✅ Day 5-6: Smart Contracts & Blockchain (COMPLETED)
**Completed Features:**

1. **ResearchToken.sol Smart Contract**
   - Deployed to Base Sepolia: `0x1221aBCe7D8FB1ba4cF9293E94539cb45e7857fE`
   - `createProposal(hypothesisId, fundingGoal, duration)` - Create funding proposals
   - `fundProposal(proposalId, amount)` - Fund existing proposals
   - `getProposal(proposalId)` - Query proposal details

2. **On-Chain Proposal Creation** (`src/functions/createProposal.ts`)
   - Automatic proposal creation when hypothesis approved
   - Integration with ACP workflow
   - Transaction verification and logging

3. **Blockchain Integration**
   - ethers.js v6 for contract interaction
   - Base Sepolia testnet configuration
   - Wallet management with Privy

### ✅ Day 7: Multi-Agent System (ACP) (COMPLETED)
**Completed Features:**

1. **ACP Coordinator** (`src/acp/coordinator.ts`)
   - Job-based multi-agent coordination
   - Payment tracking in VIRTUAL tokens (mock)
   - Status tracking: pending → in_progress → completed

2. **Peer Review Agent** (`src/agents/peerReviewAgent.ts`)
   - Evaluates hypotheses on 4 criteria (novelty, feasibility, impact, rigor)
   - Scores 0-10 with detailed feedback
   - Approval threshold: ≥7.0 overall score
   - Provides strengths, weaknesses, recommendations

3. **Data Curator Agent** (`src/agents/dataCuratorAgent.ts`)
   - Searches Kaggle, UCI ML, PubMed Central
   - Returns relevant datasets with URLs
   - Dataset count tracking

4. **Multi-Agent Workflow**
   - Research Agent → ACP Coordinator → Peer Review + Data Curator
   - Parallel agent execution
   - Automatic proposal creation on approval

### ✅ Day 8: Frontend Dashboard (COMPLETED)
**Completed Features:**

1. **React Dashboard** (`frontend/`)
   - Real-time agent statistics
   - Hypothesis list with peer review scores
   - Funding proposals with progress bars
   - Papers analyzed view
   - Activity feed
   - Multi-agent stats

2. **API Server** (`api/`)
   - Express + TypeScript
   - Endpoints: `/status`, `/hypotheses`, `/proposals`, `/papers`, `/activity`, `/agents`
   - Reads from `research_log.json`
   - Auto-refresh every 5 seconds

3. **Wallet Integration**
   - Privy authentication (email, social, Web3)
   - Base Sepolia network support
   - Smart contract interaction from UI
   - Create proposals button on hypotheses
   - Fund proposals button with progress updates

### ✅ Day 9: Demo & Polish (COMPLETED)
**Completed Features:**

1. **Full Workflow Demo** (`demo/run_demo.ts`)
   - Complete autonomous pipeline demonstration
   - 2-5 minute runtime
   - Real arXiv papers, GPT-4 analysis, ACP coordination
   - Beautiful terminal output with colors

2. **UI/UX Improvements**
   - Optimistic UI updates for funding
   - Progress bars with smooth transitions
   - Transaction links to BaseScan
   - Loading states and error handling
   - Responsive design

### ✅ Day 10: Documentation (IN PROGRESS)
**Completed:**
- ✅ Comprehensive README.md
- ✅ Architecture diagram in ASCII
- 🔄 Code comments (in progress)

### 🔜 Day 11-14: Final Testing & Submission
**Remaining Tasks:**
- Video demo recording
- Pitch deck creation
- Final testing across all components
- Hackathon submission

## 🎯 Hackathon Project

**Built for:** Virtuals Protocol Hackathon
**Category:** Autonomous AI Agents + DeSci
**Timeline:** 10 days (Day 1-10 complete)
**Status:** ✅ Fully Functional

### What Makes This Special?

1. **Complete Autonomy**: No human in the loop from paper discovery to on-chain proposals
2. **Multi-Agent ACP**: Real implementation of Agent Commerce Protocol
3. **Real AI**: GPT-4 for analysis, not simulated responses
4. **Blockchain Native**: Smart contracts on Base L2, not centralized database
5. **Production Ready**: Error handling, testing, monitoring, logging

### Demo Video

🎥 [Watch the full demo video](link-to-video) *(Coming soon)*

### Live Demo

🌐 [Try the live dashboard](link-to-deployment) *(Coming soon)*

## 🗂️ Project Structure

```
sciencedao-agent/
├── src/                          # Backend agent system
│   ├── functions/                # GAME SDK functions
│   │   ├── fetchPapers.ts          # arXiv paper fetching
│   │   ├── analyzePaper.ts         # GPT-4 analysis
│   │   ├── generateHypothesis.ts   # Hypothesis generation
│   │   ├── reviewHypothesis.ts     # Peer review logic
│   │   ├── findDatasets.ts         # Dataset discovery
│   │   └── createProposal.ts       # On-chain proposals
│   ├── workers/                  # GAME workers
│   │   └── researchWorker.ts       # Research coordinator
│   ├── agents/                   # AI agents
│   │   ├── scienceAgent.ts         # Main research agent
│   │   ├── peerReviewAgent.ts      # Peer review agent
│   │   └── dataCuratorAgent.ts     # Data curator agent
│   ├── acp/                      # Agent Commerce Protocol
│   │   └── coordinator.ts          # Multi-agent orchestration
│   ├── utils/                    # Utilities
│   │   ├── config.ts               # Configuration
│   │   └── logger.ts               # Activity logging
│   └── index.ts                  # Main entry point
├── api/                          # Express API server
│   ├── src/
│   │   ├── routes.ts               # API endpoints
│   │   ├── types.ts                # TypeScript types
│   │   └── server.ts               # Express server
│   └── package.json
├── frontend/                     # React dashboard
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── HypothesisList.tsx
│   │   │   ├── ProposalsList.tsx
│   │   │   ├── PapersList.tsx
│   │   │   ├── ActivityFeed.tsx
│   │   │   └── AgentStats.tsx
│   │   ├── types.ts                # Frontend types
│   │   └── main.tsx                # Entry point
│   └── package.json
├── demo/                         # Demo scripts
│   └── run_demo.ts                 # Full workflow demo
├── tests/                        # Test suite
├── data/                         # Data storage
│   └── research_log.json           # Activity logs
├── config/                       # Configuration
│   ├── contract.json               # Contract addresses
│   └── ResearchToken.json          # Contract ABI
├── contracts/                    # Smart contracts (Hardhat)
│   └── ResearchToken.sol
├── .env.example                  # Environment template
├── tsconfig.json                 # TypeScript config
├── package.json                  # Root dependencies
└── README.md                     # This file
```

## 🤝 Contributing

This is a hackathon project currently in active development. After the hackathon, we plan to:

- 🌐 **Open Source**: Fully open the codebase for community contributions
- 🏛️ **DAO Governance**: Build a DAO for community-driven research priorities
- 🤝 **DeSci Partnerships**: Collaborate with other DeSci projects
- 🔬 **Research Expansion**: Add more data sources and analysis capabilities
- 💰 **Token Economics**: Implement proper tokenomics for the research ecosystem

### Future Enhancements

- [ ] Add more data sources (PubMed, bioRxiv, SSRN)
- [ ] Support for more research fields
- [ ] Advanced peer review with multiple reviewers
- [ ] Integration with lab automation APIs
- [ ] NFT-based research credentials
- [ ] Quadratic funding for proposals
- [ ] Cross-chain deployment (Ethereum, Polygon, etc.)

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🔗 Resources & Links

### Documentation
- **GAME SDK:** [https://docs.game.virtuals.io/](https://docs.game.virtuals.io/)
- **Virtuals Protocol:** [https://whitepaper.virtuals.io/](https://whitepaper.virtuals.io/)
- **ACP Documentation:** [https://docs.virtuals.io/acp](https://docs.virtuals.io/acp)

### APIs & Services
- **arXiv API:** [http://export.arxiv.org/api_help](http://export.arxiv.org/api_help)
- **OpenAI API:** [https://platform.openai.com/docs](https://platform.openai.com/docs)
- **Base Network:** [https://docs.base.org/](https://docs.base.org/)
- **Privy Docs:** [https://docs.privy.io/](https://docs.privy.io/)

### Blockchain
- **Base Sepolia Faucet:** [https://www.coinbase.com/faucets/base-ethereum-goerli-faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- **BaseScan (Sepolia):** [https://sepolia.basescan.org/](https://sepolia.basescan.org/)
- **Contract Address:** `0x1221aBCe7D8FB1ba4cF9293E94539cb45e7857fE`

## 👥 Team

**ScienceDAO Team** - Building the future of autonomous scientific research

*This project was built during the Virtuals Protocol Hackathon to demonstrate the power of autonomous AI agents in scientific research.*

## 🙏 Acknowledgments

- **Virtuals Protocol** for the GAME SDK and ACP framework
- **OpenAI** for GPT-4 API access
- **arXiv** for providing open access to research papers
- **Base Network** for L2 infrastructure
- **Privy** for seamless wallet authentication
- **The DeSci Community** for inspiration and support

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/sciencedao-agent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/sciencedao-agent/discussions)
- **Twitter**: [@ScienceDAO](https://twitter.com/sciencedao) *(Coming soon)*

---

<div align="center">

**Status:** ✅ Day 10 Complete - Documentation Finished

Built with ❤️ for the Virtuals Protocol Hackathon

**"Accelerating scientific discovery through autonomous AI agents"**

[⭐ Star this repo](https://github.com/yourusername/sciencedao-agent) • [🐛 Report Bug](https://github.com/yourusername/sciencedao-agent/issues) • [✨ Request Feature](https://github.com/yourusername/sciencedao-agent/issues)

</div>
