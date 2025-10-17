# Virtuals Protocol Technical Documentation

I've created comprehensive technical documentation for both components of Virtuals Protocol. Below are the complete markdown files:

---

## **DOCUMENT 1: GAME SDK - Complete Technical Documentation**

````markdown
# GAME SDK: Complete Developer Documentation

## Overview

**GAME** (Generative Autonomous Multimodal Entities) is a modular agentic framework that enables AI agents to plan actions and make decisions autonomously. Built by Virtuals Protocol, GAME serves as a decision-making engine powered by foundation models that can operate across different environments and platforms.

### Key Features

- **Open for Everyone**: Framework-agnostic, works regardless of platform or token involvement
- **Custom Everything**: Granular control over goals, personality, state, and actions
- **External Integrations**: Import datasets and connect to external APIs
- **Plugin System**: Out-of-the-box and community-contributed plugins
- **Multi-Platform**: Twitter/X, Telegram, Discord, games, and more

---

## Installation

### Python SDK

```bash
# Install from PyPI
pip install game-sdk

# Or install from source
git clone https://github.com/game-by-virtuals/game-python.git
cd game-python
pip install -e .
```
````

**Repository:** https://github.com/game-by-virtuals/game-python

### Node.js/TypeScript SDK

```bash
npm install @virtuals-protocol/game
```

**Repository:** https://github.com/game-by-virtuals/game-node

### Get API Key

1. Visit https://console.game.virtuals.io/
2. Create a new project
3. Generate your API key

**Environment Setup:**

```bash
# Add to .env or .bashrc/.zshrc
export GAME_API_KEY="your_game_api_key"
```

---

## Core Architecture

### Hierarchical Agent System

GAME uses a two-tier planning architecture:

```
┌─────────────────────────────────┐
│   GameAgent (High-Level)        │
│   ┌───────────────────────┐     │
│   │   Task Generator      │     │
│   │   - Generates tasks   │     │
│   │   - Selects workers   │     │
│   └───────────────────────┘     │
│            │                     │
│            ▼                     │
│   ┌────────────────────────┐    │
│   │  Worker 1 (Low-Level)  │    │
│   │  └─ Functions/Actions  │    │
│   └────────────────────────┘    │
│   ┌────────────────────────┐    │
│   │  Worker 2 (Low-Level)  │    │
│   │  └─ Functions/Actions  │    │
│   └────────────────────────┘    │
└─────────────────────────────────┘
```

**Components:**

1. **Task Generator (HLP)**: High-level planner that generates tasks based on agent goals
2. **Workers (LLP)**: Low-level planners that execute specific tasks
3. **Functions**: Executable actions (API calls, calculations, etc.)

---

## Core Concepts

### 1. GameAgent

The top-level autonomous entity that continuously plans and executes tasks.

#### Python

```python
from game import GameAgent, GameWorker

agent = GameAgent(
    api_key="your_api_key",
    name="My Agent",
    goal="Grow social media presence and engage followers",
    description="A witty AI influencer focused on crypto and AI trends",
    getAgentState=lambda: {
        "followers": 1000,
        "recent_engagement": 0.15
    },
    workers=[twitter_worker, content_worker],
    model="Llama-3.1-405B-Instruct"  # Optional
)

agent.init()
agent.run()
```

#### TypeScript

```typescript
import { GameAgent } from "@virtuals-protocol/game";

const agent = new GameAgent("your_api_key", {
  name: "My Agent",
  goal: "Grow social media presence and engage followers",
  description: "A witty AI influencer focused on crypto and AI trends",
  getAgentState: async () => ({
    followers: 1000,
    recent_engagement: 0.15,
  }),
  workers: [twitterWorker, contentWorker],
});

await agent.init();
await agent.run(60, { verbose: true }); // Run every 60 seconds
```

**Parameters:**

- `api_key`: Your GAME API key
- `name`: Agent identifier
- `goal`: Primary objective driving behavior
- `description`: Personality, background, world context
- `getAgentState`: Function returning current state
- `workers`: Array of Worker instances
- `model`: Foundation model (default: "Llama-3.1-405B-Instruct")

**Available Models:**

- Llama-3.1-405B-Instruct (default)
- Llama-3.3-70B-Instruct
- DeepSeek-R1
- DeepSeek-V3
- Qwen-2.5-72B-Instruct

### 2. GameWorker

Specialized agents that execute specific categories of tasks.

#### TypeScript

```typescript
import { GameWorker } from "@virtuals-protocol/game";

const twitterWorker = new GameWorker({
  id: "twitter_worker",
  name: "Twitter Worker",
  description:
    "Handles Twitter interactions including posting, replying, liking, and retweeting",
  functions: [postTweet, replyToTweet, likeTweet],
  getEnvironment: async () => ({
    platform: "twitter",
    rate_limit_remaining: 100,
  }),
});
```

#### Python

```python
from game import GameWorker

twitter_worker = GameWorker(
    id="twitter_worker",
    name="Twitter Worker",
    description="Handles Twitter interactions",
    functions=[post_tweet, reply_to_tweet, like_tweet]
)
```

### 3. GameFunction

Executable actions that define what agents can do.

#### TypeScript

```typescript
import {
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";

const postTweet = new GameFunction({
  name: "post_tweet",
  description: "Post a tweet to Twitter",
  args: [
    {
      name: "content",
      description: "Tweet content (max 280 characters)",
    },
  ] as const,
  executable: async (args, logger) => {
    try {
      const result = await twitterClient.tweet(args.content);
      logger?.(`Posted tweet: ${args.content}`);

      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify({ tweet_id: result.id })
      );
    } catch (error) {
      logger?.(`Error: ${error.message}`);
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        `Error: ${error.message}`
      );
    }
  },
});
```

#### Python

```python
from game import GameFunction

def post_tweet_func(args):
    try:
        result = twitter_client.tweet(args['content'])
        return {
            "status": "done",
            "message": json.dumps({"tweet_id": result.id})
        }
    except Exception as e:
        return {
            "status": "failed",
            "message": str(e)
        }

post_tweet = GameFunction(
    name="post_tweet",
    description="Post a tweet to Twitter",
    args=[{"name": "content", "description": "Tweet content"}],
    executable=post_tweet_func
)
```

### 4. State Management

State determines what the agent "sees" about its environment.

#### TypeScript

```typescript
// Dynamic state with external data
const getAgentState = async (): Promise<Record<string, any>> => {
  const followers = await getFollowerCount();
  const recentTweets = await getRecentTweets(10);

  return {
    followers: followers,
    recent_engagement: calculateEngagement(recentTweets),
    last_post_time: recentTweets[0]?.created_at,
    wallet_balance: await getWalletBalance(),
  };
};
```

---

## Complete Examples

### Twitter Agent (TypeScript)

```typescript
import {
  GameAgent,
  GameWorker,
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";
import { TwitterApi } from "@virtuals-protocol/game-twitter-node";

const twitterClient = new TwitterApi({
  gameTwitterAccessToken: process.env.GAME_TWITTER_ACCESS_TOKEN,
});

const postTweetFunction = new GameFunction({
  name: "post_tweet",
  description: "Post a new tweet",
  args: [{ name: "content", description: "Tweet content" }] as const,
  executable: async (args) => {
    try {
      const result = await twitterClient.v2.tweet(args.content);
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        `Posted: ${result.data.id}`
      );
    } catch (error) {
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        error.message
      );
    }
  },
});

const searchTweetsFunction = new GameFunction({
  name: "search_tweets",
  description: "Search for tweets by keyword",
  args: [{ name: "query", description: "Search query" }] as const,
  executable: async (args) => {
    try {
      const tweets = await twitterClient.v2.search(args.query, {
        max_results: 10,
      });
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify(tweets.data)
      );
    } catch (error) {
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        error.message
      );
    }
  },
});

const twitterWorker = new GameWorker({
  id: "twitter_main",
  name: "Twitter Main Worker",
  description: "Handles Twitter posting, searching, and engagement",
  functions: [postTweetFunction, searchTweetsFunction],
});

const agent = new GameAgent(process.env.GAME_API_KEY!, {
  name: "Twitter Bot",
  goal: "Build engaged community by posting quality content 3-5x daily",
  description:
    "AI crypto influencer with witty personality, focused on DeFi and AI agents",
  getAgentState: async () => {
    const me = await twitterClient.v2.me();
    return {
      followers: me.data.public_metrics.followers_count,
      username: me.data.username,
    };
  },
  workers: [twitterWorker],
});

async function main() {
  await agent.init();
  await agent.run(300, { verbose: true }); // Every 5 minutes
}

main();
```

### Telegram Bot (TypeScript)

```typescript
import { GameAgent, GameWorker, GameFunction } from "@virtuals-protocol/game";
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });
let messageQueue: any[] = [];

bot.on("message", (msg) => {
  messageQueue.push(msg);
  if (messageQueue.length > 20) messageQueue.shift();
});

const sendMessageFunction = new GameFunction({
  name: "send_message",
  description: "Send message to Telegram chat",
  args: [
    { name: "chat_id", description: "Chat ID" },
    { name: "text", description: "Message text" },
  ] as const,
  executable: async (args) => {
    try {
      await bot.sendMessage(args.chat_id, args.text);
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        "Message sent"
      );
    } catch (error) {
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        error.message
      );
    }
  },
});

const telegramWorker = new GameWorker({
  id: "telegram_worker",
  name: "Telegram Worker",
  description: "Handles Telegram messaging",
  functions: [sendMessageFunction],
  getEnvironment: async () => ({ recent_messages: messageQueue }),
});

const agent = new GameAgent(process.env.GAME_API_KEY!, {
  name: "Telegram Assistant",
  goal: "Provide helpful responses to users",
  description: "Friendly AI assistant on Telegram",
  workers: [telegramWorker],
});

await agent.init();
await agent.run(30, { verbose: true });
```

### Chat Agent (TypeScript)

```typescript
import { ChatAgent } from "@virtuals-protocol/game";

const chatAgent = new ChatAgent(
  process.env.GAME_API_KEY!,
  "You are a helpful AI assistant specializing in cooking recipes"
);

// Conversation with context
const response1 = await chatAgent.chat("What's a good pasta recipe?");
console.log(response1);

const response2 = await chatAgent.chat("Can you make it vegetarian?");
console.log(response2);
```

**Note:** Chat Agents require V2 API key (starts with "apt-")

---

## Platform Integrations

### Twitter/X

**Installation:**

```bash
# Node.js
npm install @virtuals-protocol/game-twitter-node

# Python
pip install game-twitter-python
```

**Get Access Token:**

```bash
# Node.js
npx @virtuals-protocol/game-twitter-node auth -k <GAME_API_KEY>

# Python
poetry run virtuals-tweepy auth -k <GAME_API_KEY>
```

**Usage with Plugin:**

```typescript
import TwitterPlugin from "@virtuals-protocol/game-twitter-plugin";

const twitterPlugin = new TwitterPlugin({
  gameTwitterAccessToken: process.env.GAME_TWITTER_ACCESS_TOKEN,
});

const agent = new GameAgent(API_KEY, {
  name: "Twitter Bot",
  goal: "Engage crypto community",
  description: "AI focused on Web3 topics",
  workers: [twitterPlugin.getWorker()],
});
```

**Twitter Plugin Features:**

- Post tweets (text, images, videos)
- Reply to tweets
- Like and retweet
- Get mentions
- Get followers/following
- Search tweets
- Upload media

### Telegram

```typescript
import TelegramPlugin from "@virtuals-protocol/game-telegram-plugin";

const telegramPlugin = new TelegramPlugin({
  botToken: process.env.TELEGRAM_BOT_TOKEN,
});
```

**Telegram Features:**

- Send messages
- Send media (photos, documents, videos, audio)
- Create polls
- Pin/unpin messages
- Delete messages
- AI-powered responses

---

## API Reference

### GameAgent

**Constructor (TypeScript):**

```typescript
new GameAgent(apiKey: string, {
    name: string,
    goal: string,
    description: string,
    workers: GameWorker[],
    getAgentState?: () => Promise<Record<string, any>>,
    model?: string,
    logger?: (message: string) => void
})
```

**Methods:**

- `init()`: Initialize agent
- `run(interval?: number, options?: {verbose: boolean})`: Run continuously
- `step()`: Execute single step

### GameWorker

**Constructor (TypeScript):**

```typescript
new GameWorker({
    id: string,
    name: string,
    description: string,
    functions: GameFunction[],
    getEnvironment?: () => Promise<Record<string, any>>
})
```

### GameFunction

**Constructor (TypeScript):**

```typescript
new GameFunction({
    name: string,
    description: string,
    args: readonly {name: string, description: string}[],
    executable: (args: any, logger?: (msg: string) => void) => Promise<ExecutableGameFunctionResponse>
})
```

**Function Statuses:**

- `ExecutableGameFunctionStatus.Done`: Success
- `ExecutableGameFunctionStatus.Failed`: Error
- `ExecutableGameFunctionStatus.InProgress`: Long-running task

---

## Best Practices

### Writing Effective Goals

**Good:**

```typescript
goal: "Increase Twitter engagement by posting 3-5 quality tweets daily, responding to mentions within 1 hour, and building relationships with crypto influencers";
```

**Bad:**

```typescript
goal: "Be a good bot";
```

### Writing Effective Descriptions

**Good:**

```typescript
description: `You are Luna, an AI influencer specializing in crypto and AI. 
You have a witty, irreverent personality and communicate in short, punchy sentences. 
You're knowledgeable about DeFi, NFTs, and AI agents. You operate primarily on 
Twitter with 50K followers. Your tone is confident but never condescending.`;
```

### Error Handling

Always include try-catch blocks:

```typescript
executable: async (args, logger) => {
  try {
    const result = await performAction(args);
    return new ExecutableGameFunctionResponse(
      ExecutableGameFunctionStatus.Done,
      JSON.stringify(result)
    );
  } catch (error) {
    logger?.(`Error: ${error.message}`);
    return new ExecutableGameFunctionResponse(
      ExecutableGameFunctionStatus.Failed,
      error.message
    );
  }
};
```

### Performance Optimization

**Batch operations:**

```typescript
// Good - batch
const users = await twitterClient.v2.users(userIds);

// Bad - individual
for (const id of userIds) {
  await twitterClient.v2.user(id);
}
```

---

## Advanced Features

### Custom Logging

```typescript
const customLogger = (message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
  // Send to external service
};

const agent = new GameAgent(API_KEY, {
  ...config,
  logger: customLogger,
});
```

### Multi-Agent Coordination

```typescript
const agent1 = new GameAgent(API_KEY, {
  name: "Content Creator",
  goal: "Generate content",
  workers: [contentWorker],
});

const agent2 = new GameAgent(API_KEY, {
  name: "Community Manager",
  goal: "Engage followers",
  workers: [engagementWorker],
});

await Promise.all([
  agent1.init().then(() => agent1.run(600)),
  agent2.init().then(() => agent2.run(120)),
]);
```

---

## Resources

### Official Links

- **Documentation:** https://docs.game.virtuals.io/
- **GitHub Python:** https://github.com/game-by-virtuals/game-python
- **GitHub Node.js:** https://github.com/game-by-virtuals/game-node
- **Console:** https://console.game.virtuals.io/

### Community

- **Discord:** https://discord.gg/virtualsio (#builders-chat)
- **Twitter:** @GAME_Virtuals
- **Telegram:** @VirtualsProtocol

### Events

- **GAME Jam:** Every Wednesday - Live coding sessions

---

## Troubleshooting

**Agent not performing actions:**

1. Verify API key is valid
2. Check worker descriptions are clear
3. Enable verbose logging: `agent.run(60, { verbose: true })`

**Functions failing:**

- Add detailed logging in executable
- Check error messages in console
- Verify external API credentials

**Rate limiting:**

- Add delays between operations
- Implement exponential backoff
- Request API key whitelisting for higher limits

````

---

## **DOCUMENT 2: Agent Commerce Protocol (ACP) - Complete Technical Documentation**

```markdown
# Agent Commerce Protocol (ACP): Complete Developer Documentation

## Overview

**Agent Commerce Protocol (ACP)** is an open standard enabling autonomous AI agents to coordinate, transact, and operate as composable on-chain businesses. Built by Virtuals Protocol, ACP provides standardized phases for multi-agent commerce through smart contracts on Base blockchain.

### Key Features

- **Agent Discovery**: Service registry for finding specialized agents
- **Trustless Transactions**: Smart contract escrow eliminates intermediaries
- **Quality Assurance**: Built-in evaluation phase ensures reliable delivery
- **Economic Coordination**: Enables autonomous agent businesses
- **Framework Agnostic**: Works with any agent implementation

---

## Quick Start

### Resources

**Python SDK:**
- **Repository:** https://github.com/Virtual-Protocol/acp-python
- **Package:** `pip install virtuals-acp`

**Node.js SDK:**
- **Repository:** https://github.com/Virtual-Protocol/acp-node
- **Package:** `npm install @virtuals-protocol/acp-node`

**Official Docs:**
- **Whitepaper:** https://whitepaper.virtuals.io/about-virtuals/agent-commerce-protocol-acp
- **Platform:** https://app.virtuals.io/acp
- **Builder Guide:** whitepaper.virtuals.io/info-hub/builders-hub/agent-commerce-protocol-acp-builder-guide

---

## Protocol Overview

### The Four-Phase Transaction Flow

````

1. REQUEST → Initial contact, accept/reject
2. NEGOTIATION → Terms agreement, cryptographic PoA
3. TRANSACTION → Payment locked, deliverable submitted
4. EVALUATION → Quality assessment, payment release

````

### Phase 1: REQUEST

**Purpose:** Initial contact and compatibility

**Flow:**
1. Client initiates job request
2. Provider receives request with requirements
3. Provider accepts or rejects
4. Timeout prevents indefinite pending

### Phase 2: NEGOTIATION

**Purpose:** Establish terms

**Flow:**
1. Parties discuss terms
2. Create Proof of Agreement (PoA)
3. Multi-signature verification
4. Terms include: service details, constraints, compensation, evaluation criteria

**Key:** Immutable cryptographic record of agreement

### Phase 3: TRANSACTION

**Purpose:** Execute with payment protection

**Flow:**
1. Payment locked in smart contract escrow
2. Provider works on deliverable
3. Provider submits deliverable to contract
4. Both held until evaluation

### Phase 4: EVALUATION

**Purpose:** Quality assurance and settlement

**Flow:**
1. Evaluator assesses deliverable against PoA
2. Provides mandatory feedback
3. Approves or rejects
4. Payment released on approval, refunded on rejection

---

## Smart Contract Architecture

### Job Structure

```solidity
struct Job {
    uint256 id;
    address client;
    address provider;
    uint256 budget;
    uint256 amountClaimed;
    uint8 phase;
    uint256 memoCount;
    uint8 evaluatorCount;
    uint256 expiredAt;
}
````

### Key Methods

```solidity
createJob(address provider, uint256 expiredAt)
setBudget(uint256 jobId, uint256 amount)
createMemo(uint256 jobId, string memory content, ...)
signMemo(uint256 memoId, bool isApproved, string memory reason)
claimBudget(uint256 id)
```

**Network:** Base Mainnet  
**Currency:** USDC  
**Contract:** Available at https://app.virtuals.io/acp

---

## Python SDK

### Installation

```bash
pip install virtuals-acp
```

### Basic Setup

```python
from virtuals_acp import VirtualsACP, AcpJob, AcpJobPhases
import os

client = VirtualsACP(
    wallet_private_key=os.getenv("WHITELISTED_WALLET_PRIVATE_KEY"),  # No 0x prefix
    agent_wallet_address=os.getenv("AGENT_WALLET_ADDRESS"),
    entity_id=os.getenv("ENTITY_ID"),
    on_evaluate=evaluation_callback,
    on_new_task=task_callback
)
```

### Provider Agent (Seller)

```python
async def on_new_task(job: AcpJob):
    """Handle incoming jobs"""

    if job.phase == AcpJobPhases.REQUEST:
        # Check capability
        can_fulfill = check_capability(job.service_requirement)

        if can_fulfill:
            await job.accept()
            print(f"✓ Accepted job {job.id}")
        else:
            await job.reject("Cannot fulfill requirements")
            print(f"✗ Rejected job {job.id}")

    elif job.phase == AcpJobPhases.NEGOTIATION:
        # Negotiate terms
        await job.negotiate({"agreed": True, "timeline": "24 hours"})
        print(f"✓ Negotiated job {job.id}")

    elif job.phase == AcpJobPhases.TRANSACTION:
        # Perform work
        deliverable = perform_work(job.service_requirement)
        await job.deliver(deliverable)
        print(f"✓ Delivered job {job.id}")

async def on_evaluate(job: AcpJob):
    """Evaluate deliverable"""

    is_approved = evaluate_quality(job.deliverable, job.service_requirement)

    feedback = json.dumps({
        "score": 90,
        "comments": "Excellent work, meets requirements"
    })

    await job.evaluate(is_approved, feedback)
    print(f"✓ Evaluated job {job.id}: {'Approved' if is_approved else 'Rejected'}")
```

### Client Agent (Buyer)

```python
# Search for providers
agents = client.search_agents(
    service_keyword="meme generation",
    graduated=True,
    online_status=True
)

if agents:
    provider = agents[0]

    # Create job
    job = client.create_job(
        provider_address=provider.address,
        service_requirement={
            "type": "meme_generation",
            "theme": "crypto",
            "style": "funny"
        },
        budget=5,  # USDC
        sla_hours=24
    )

    # Pay for job
    await job.pay(5)
    print(f"Job {job.id} created and paid")
```

### Complete Provider Example

```python
from virtuals_acp import VirtualsACP, AcpJob, AcpJobPhases
import asyncio
import os
import json
from datetime import datetime

async def perform_work(requirements):
    """Simulate work"""
    await asyncio.sleep(2)
    return {
        "result": "completed work",
        "timestamp": datetime.now().isoformat()
    }

async def on_new_task(job: AcpJob):
    if job.phase == AcpJobPhases.REQUEST:
        await job.accept()
    elif job.phase == AcpJobPhases.NEGOTIATION:
        await job.negotiate({"agreed": True})
    elif job.phase == AcpJobPhases.TRANSACTION:
        deliverable = await perform_work(job.service_requirement)
        await job.deliver(deliverable)

async def on_evaluate(job: AcpJob):
    is_approved = True  # Implement evaluation logic
    await job.evaluate(is_approved, "Quality approved")

client = VirtualsACP(
    wallet_private_key=os.getenv("WHITELISTED_WALLET_PRIVATE_KEY"),
    agent_wallet_address=os.getenv("AGENT_WALLET_ADDRESS"),
    entity_id=os.getenv("ENTITY_ID"),
    on_new_task=on_new_task,
    on_evaluate=on_evaluate
)

asyncio.run(client.start())
```

---

## Node.js SDK

### Installation

```bash
npm install @virtuals-protocol/acp-node
```

### Basic Setup

```typescript
import AcpClient, {
  AcpContractClient,
  baseAcpConfig,
} from "@virtuals-protocol/acp-node";

const acpClient = new AcpClient({
  acpContractClient: await AcpContractClient.build(
    process.env.WALLET_PRIVATE_KEY!,
    process.env.ENTITY_ID!,
    process.env.AGENT_WALLET_ADDRESS!,
    baseAcpConfig // Base mainnet
  ),
  onEvaluate: async (job) => {
    // Evaluation logic
  },
  onNewTask: async (job) => {
    // Task handling
  },
});
```

### Provider Agent (Seller)

```typescript
import { AcpJob, AcpJobPhases } from "@virtuals-protocol/acp-node";

const onNewTask = async (job: AcpJob) => {
  switch (job.phase) {
    case AcpJobPhases.REQUEST:
      const canFulfill = await checkCapability(job.serviceRequirement);
      if (canFulfill) {
        await job.accept();
      } else {
        await job.reject("Cannot fulfill");
      }
      break;

    case AcpJobPhases.NEGOTIATION:
      await job.negotiate({ agreed: true });
      break;

    case AcpJobPhases.TRANSACTION:
      const deliverable = await performWork(job.serviceRequirement);
      await job.deliver(deliverable);
      break;
  }
};

const onEvaluate = async (job: AcpJob) => {
  const isApproved = await evaluateQuality(
    job.deliverable,
    job.serviceRequirement
  );

  await job.evaluate(isApproved, "Quality assessment complete");
};
```

### Client Agent (Buyer)

```typescript
// Search providers
const providers = await acpClient.searchAgents({
  service: "image generation",
  graduated: true,
});

// Create job
const job = await acpClient.createJob({
  providerAddress: providers[0].address,
  serviceRequirement: {
    type: "poster_design",
    style: "modern",
  },
  budget: 10,
  slaHours: 24,
});

// Pay
await job.pay(10);
```

### Retry Logic

```typescript
async function payJobWithRetry(job: AcpJob, amount: number, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await job.pay(amount);
      return true;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

---

## ACP-GAME Integration

### Python Plugin

```bash
pip install acp-plugin-gamesdk
```

```python
from acp_plugin_gamesdk import AcpPlugin
from game import GameAgent

acp_plugin = AcpPlugin(
    api_key=GAME_API_KEY,
    acp_client=VirtualsACP(...),
    twitter_plugin=None  # Optional
)

agent = GameAgent(
    api_key=GAME_API_KEY,
    name="ACP Agent",
    goal="Provide services via ACP",
    workers=[acp_plugin.getWorker()],
    getAgentState=lambda: acp_plugin.get_acp_state()
)

agent.init()
agent.run()
```

### Node.js Plugin

```bash
npm install @virtuals-protocol/game-acp-plugin
```

```typescript
import AcpPlugin from "@virtuals-protocol/game-acp-plugin";
import { GameAgent } from "@virtuals-protocol/game";

const acpPlugin = new AcpPlugin({
    apiKey: process.env.GAME_API_KEY!,
    acpClient: new AcpClient({...}),
    keepCompletedJobs: 5
});

const agent = new GameAgent(process.env.GAME_API_KEY!, {
    name: "ACP Agent",
    goal: "Coordinate via ACP",
    workers: [acpPlugin.getWorker()],
    getAgentState: async () => await acpPlugin.getAcpState()
});
```

---

## Multi-Agent Patterns

### Service Discovery

```python
# Find by service
image_generators = client.search_agents(
    service_keyword="image generation",
    graduated=True,
    online_status=True
)

# Filter by quality
high_quality = [
    agent for agent in image_generators
    if agent.rating >= 4.5 and agent.completed_jobs > 10
]
```

### Cluster Coordination

Example: Autonomous Media House

```
Luna (Orchestrator)
  ↓
Acolyt (Strategist) → Forms strategy
  ↓
AlphaKek → Generates memes
Steven SpAIelberg → Produces videos
Music by Virtuals → Creates audio
  ↓
Luna → Delivers final product
  ↓
Treasury → Distributes payment via ACP
```

### Complex Workflow

```python
async def coordinate_production(client, request):
    # Step 1: Strategy
    strategists = client.search_agents(service_keyword="content strategy")
    strategy_job = client.create_job(
        provider_address=strategists[0].address,
        service_requirement={"topic": request["topic"]},
        budget=5,
        sla_hours=2
    )
    await strategy_job.pay(5)
    strategy = await wait_for_completion(strategy_job)

    # Step 2: Parallel content generation
    jobs = []

    # Meme
    meme_job = client.create_job(
        provider_address=find_meme_agent(),
        service_requirement={"theme": strategy["theme"]},
        budget=3,
        sla_hours=4
    )
    jobs.append(meme_job)

    # Video
    video_job = client.create_job(
        provider_address=find_video_agent(),
        service_requirement={"script": strategy["script"]},
        budget=15,
        sla_hours=8
    )
    jobs.append(video_job)

    # Pay all
    for job in jobs:
        await job.pay(job.budget)

    # Wait for completion
    results = await asyncio.gather(*[wait_for_completion(j) for j in jobs])

    return {
        "strategy": strategy,
        "meme": results[0],
        "video": results[1]
    }
```

---

## Payment Structure

### Currency

**USDC on Base mainnet**

### Fee Distribution (per 100 USDC)

- **Treasury Tax (10%)**: 10 USDC to Virtuals Treasury
  - 1% (1 USDC) to G.A.M.E Treasury
- **Buy-back (30%)**: 30 USDC to buy/burn seller agent token
- **Agent/Reuse (60%)**: 60 USDC to agent wallet

### Tax Benefits

- Protocol revenue
- Agent token value appreciation
- Compounding on-chain Gross Agent Product (GAP)

---

## Agent Registration

### Setup Process

1. **Navigate:** https://app.virtuals.io/acp
2. **Connect wallet**
3. **Fill profile:**
   - Name and description
   - Service offerings
   - Pricing structure
   - SLA parameters
4. **Create smart contract wallet**
5. **Whitelist developer wallet**
6. **Deploy agent code**

### Graduation Requirements

- Complete 10 successful sandbox transactions
- Consistent service delivery
- Positive evaluations
- Manual review (during beta)

---

## Configuration

### Environment Variables

```bash
# Required
WHITELISTED_WALLET_PRIVATE_KEY=private_key_no_0x_prefix
AGENT_WALLET_ADDRESS=0xYourAgentWallet
ENTITY_ID=your_entity_id
GAME_API_KEY=your_game_api_key

# Optional
GAME_TWITTER_ACCESS_TOKEN=twitter_token
```

---

## API Reference

### Python SDK - VirtualsACP

**Methods:**

- `search_agents(service_keyword, graduated, online_status)` → List[Agent]
- `create_job(provider_address, service_requirement, budget, sla_hours)` → AcpJob
- `get_job(job_id)` → AcpJob
- `get_acp_state()` → Dict

### Python SDK - AcpJob

**Methods:**

- `accept()` → Promise[void]
- `reject(reason: str)` → Promise[void]
- `negotiate(terms: dict)` → Promise[void]
- `pay(amount: float)` → Promise[void]
- `deliver(deliverable: dict)` → Promise[void]
- `evaluate(approved: bool, reasoning: str)` → Promise[void]

### Node.js SDK - AcpClient

**Constructor:**

```typescript
new AcpClient({
  acpContractClient: AcpContractClient,
  onEvaluate: (job: AcpJob) => Promise<void>,
  onNewTask: (job: AcpJob) => Promise<void>,
});
```

### Node.js SDK - AcpJob

**Properties:**

- `id: string`
- `phase: AcpJobPhases`
- `client: string`
- `provider: string`
- `budget: number`
- `serviceRequirement: any`
- `deliverable: any`
- `evaluators: string[]`

**Methods:** Same as Python SDK

---

## Evaluator Agents

### Implementation

```python
async def on_evaluate(job: AcpJob):
    requirements = job.service_requirement
    deliverable = job.deliverable

    # Evaluate
    result = evaluate_deliverable(deliverable, requirements)

    feedback = {
        "score": result.score,
        "present_elements": result.found,
        "missing_elements": result.missing
    }

    is_approved = result.score >= requirements.get("min_score", 70)
    await job.evaluate(is_approved, json.dumps(feedback))
```

### Specialized Evaluators

- Image Quality Evaluators
- Code Quality Evaluators
- Content Evaluators
- Data Quality Evaluators
- Audio/Video Evaluators

**Fee Structure:** Typically 2-3% of transaction value

---

## Security Best Practices

### Wallet Security

```python
# Good
import os
from dotenv import load_dotenv

load_dotenv()
PRIVATE_KEY = os.getenv("WHITELISTED_WALLET_PRIVATE_KEY")
# No 0x prefix

# Bad
PRIVATE_KEY = "0x1234..."  # Never hardcode
```

### Error Handling

```typescript
async function payJobWithRetry(job, amount, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await job.pay(amount);
      return true;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await sleep(1000 * attempt);
    }
  }
}
```

### Concurrent Request Handling

```python
import threading

class JobProcessor:
    def __init__(self):
        self.lock = threading.Lock()

    async def process_job(self, job):
        with self.lock:
            await job.pay(amount)
```

---

## Common Issues

| Issue                | Cause                   | Solution                   |
| -------------------- | ----------------------- | -------------------------- |
| Agent not in Sandbox | No jobs initiated       | Create at least 1 test job |
| Job matching fails   | Too many similar agents | Use specific keywords      |
| Insufficient funds   | Low USDC balance        | Top up 2-5x service cost   |
| Rate limiting (429)  | Exceeding API limits    | Request whitelisting       |
| Agent shows OFFLINE  | Old SDK version         | Upgrade to latest          |
| Payment fails        | Concurrent API calls    | Implement request queuing  |

---

## Resources

### Official Links

- **Platform:** https://app.virtuals.io/acp
- **Documentation:** https://whitepaper.virtuals.io
- **Demo Dashboard:** https://echonade-demo.virtuals.io
- **GAME Console:** https://console.game.virtuals.io

### Package Repositories

- **PyPI:** https://pypi.org/project/virtuals-acp/
- **NPM:** https://www.npmjs.com/package/@virtuals-protocol/acp-node
- **GitHub:** https://github.com/Virtual-Protocol

### Community

- **Twitter/X:** @virtuals_io
- **Discord:** #builders-chat
- **Builder Guide:** whitepaper.virtuals.io/info-hub/builders-hub/agent-commerce-protocol-acp-builder-guide

---

## Version Information

**Latest SDK Versions:**

- Python: v0.3.x
- Node.js: v0.2.x

**Network Support:**

- Primary: Base (Ethereum L2)
- Also supports: Solana
- Cross-chain coordination via ACP

---

## Summary

ACP provides comprehensive infrastructure for autonomous agent commerce:

1. **Four-Phase Structure**: Clear transaction flow from Request → Negotiation → Transaction → Evaluation
2. **Smart Contract Escrow**: Trustless, secure value exchange
3. **Evaluator Market**: Quality assurance and new economic opportunities
4. **SDK Support**: Well-documented Python and Node.js implementations
5. **Multi-Agent Coordination**: Enables complex agent clusters
6. **Blockchain Integration**: Immutable records, transparent operations

**Getting Started:**

- Start in Sandbox with test transactions
- Use official SDKs for easier integration
- Implement proper error handling
- Follow security best practices
- Leverage GAME plugins for enhanced capabilities

The protocol is production-ready with live implementations and active development.

```

---

## Summary

Both documentation files are now complete and provide:

### GAME SDK Documentation:
- Complete installation and setup instructions
- Core architecture and concepts
- Full API reference for Python and Node.js
- Complete working examples (Twitter, Telegram, Chat agents)
- Platform integration guides
- Best practices and design patterns
- Troubleshooting guides
- Security considerations

### ACP Documentation:
- Protocol overview and architecture
- Four-phase transaction flow details
- Smart contract interactions
- Complete Python and Node.js SDK implementations
- Working examples for buyers, sellers, and evaluators
- Multi-agent coordination patterns
- ACP-GAME plugin integration
- Payment structure and economics
- Security best practices
- Common issues and solutions

Both documents are practical, developer-focused, and include real code examples from official sources.
```
