# 🔬 ScienceDAO - Autonomous Research Agents

An autonomous AI agent system that conducts scientific research without human intervention, built for the Virtuals Protocol hackathon.

## 🎯 Project Overview

ScienceDAO enables autonomous AI agents to:
- 📚 Scan arXiv/PubMed 24/7 for latest research papers
- 🔍 Identify research gaps through AI analysis
- 💡 Generate novel, testable hypotheses
- 🤝 Coordinate via ACP (Agent Commerce Protocol)
- 💰 Create tokenized funding proposals on-chain
- 📊 Provide transparent, verifiable research activity

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                ScienceDAO System                     │
└─────────────────────────────────────────────────────┘
           │                 │                 │
    ┌──────▼───────┐  ┌─────▼──────┐  ┌──────▼───────┐
    │  Research    │  │    Data    │  │ Peer Review  │
    │    Agent     │◄─┤  Curator   │◄─┤    Agent     │
    │  (Main AI)   │  │   Agent    │  │              │
    └──────┬───────┘  └────────────┘  └──────────────┘
           │
    ┌──────▼───────┐
    │     ACP      │
    │ Coordinator  │
    └──────┬───────┘
           │
    ┌──────▼───────┐
    │   Smart      │
    │  Contracts   │
    │  (Base L2)   │
    └──────────────┘
```

## 📦 Tech Stack

- **Backend:** TypeScript, Node.js
- **AI Framework:** GAME SDK (@virtuals-protocol/game)
- **Multi-Agent:** ACP (Agent Commerce Protocol)
- **Blockchain:** Base L2, Ethers.js v6
- **APIs:** arXiv, OpenAI GPT-4
- **Utilities:** axios, xml2js, dotenv

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ (v18.18.2 tested)
- npm v9+
- OpenAI API key
- GAME API key (from https://console.game.virtuals.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd sciencedao-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

4. **Add your API keys to `.env`:**
   ```env
   GAME_API_KEY=your_game_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running Tests

**Test paper fetching from arXiv:**
```bash
npm run test:fetch
```

**Test paper analysis with GPT-4:**
```bash
npm run test:analyze
```

**Test hypothesis generation:**
```bash
npm run test:hypothesis
```

**Test complete research agent:**
```bash
npm run test:agent
```

**Test full research pipeline:**
```bash
npm run test:pipeline
```

**Run all tests:**
```bash
npm run test:all
```

**Run the autonomous agent:**
```bash
npm start
```

## 📋 Progress

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
│   └── testFullPipeline.ts    # Integration tests
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
| `npm run start` | Run the autonomous research agent |
| `npm run test:fetch` | Test paper fetching from arXiv |
| `npm run test:analyze` | Test paper analysis with GPT-4 |
| `npm run test:hypothesis` | Test hypothesis generation ✨ NEW |
| `npm run test:agent` | Test complete research workflow ✨ NEW |
| `npm run test:pipeline` | Test full pipeline |
| `npm run test:all` | Run all tests ✨ NEW |
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

### ✅ Day 3: Hypothesis Generator & Research Agent (CURRENT)
- ✅ Generate novel hypotheses
- ✅ Multi-criteria scoring system
- ✅ Research worker coordinator
- ✅ Dr. ScienceDAO autonomous agent
- ✅ Complete end-to-end workflow

### 🔜 Day 4: Testing & Refinement
- End-to-end testing
- Error handling improvements
- Performance optimization

### 🔜 Day 5: Smart Contracts
- Deploy ResearchToken.sol
- Deploy FundingProposal.sol
- On-chain proposal creation

### 🔜 Day 6-7: Multi-Agent System (ACP)
- Data Curator Agent
- Peer Review Agent
- ACP coordination

### 🔜 Day 8: Frontend Dashboard
- React dashboard
- Real-time statistics
- API server

### 🔜 Day 9: Demo & Polish
- Demo script
- Video recording
- Documentation

### 🔜 Day 10-14: Final Testing & Submission
- Complete documentation
- Pitch deck
- Final submission

## 🤝 Contributing

This is a hackathon project. After the hackathon, we plan to:
- Open source the codebase
- Welcome community contributions
- Build a DAO for governance
- Partner with DeSci projects

## 📄 License

MIT License

## 🔗 Resources

- **GAME SDK Docs:** https://docs.game.virtuals.io/
- **Virtuals Protocol:** https://whitepaper.virtuals.io/
- **arXiv API:** http://export.arxiv.org/api_help
- **Base Network:** https://docs.base.org/

## 👥 Team

ScienceDAO Team - Building the future of autonomous scientific research

## 🙏 Acknowledgments

- Virtuals Protocol for GAME SDK
- OpenAI for GPT-4 API
- arXiv for open access to research papers
- Base Network for L2 infrastructure

---

**Status:** Day 3 Complete ✅ | Next: Day 4 - Testing & Refinement

For detailed completion summaries, see:
- [DAY2_COMPLETION_SUMMARY.md](./DAY2_COMPLETION_SUMMARY.md) - Paper Fetcher & Analyzer
- [DAY3_COMPLETION_SUMMARY.md](./DAY3_COMPLETION_SUMMARY.md) - Hypothesis Generator & Research Agent
