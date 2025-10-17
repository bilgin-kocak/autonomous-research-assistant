import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuration manager for ScienceDAO Agent
 * Loads and validates all required API keys and settings
 */
export class Config {
  // API Keys
  static readonly GAME_API_KEY = process.env.GAME_API_KEY || '';
  static readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
  static readonly BASE_RPC_URL = process.env.BASE_RPC_URL || '';
  static readonly WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || '';

  // arXiv API Settings
  static readonly ARXIV_API_URL = 'http://export.arxiv.org/api/query';
  static readonly ARXIV_RATE_LIMIT_MS = 3000; // 1 request per 3 seconds
  static readonly ARXIV_MAX_RESULTS = 10;

  // OpenAI Settings
  static readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  static readonly OPENAI_MODEL = 'gpt-4';
  static readonly OPENAI_TEMPERATURE_ANALYSIS = 0.3; // More factual for paper analysis
  static readonly OPENAI_TEMPERATURE_HYPOTHESIS = 0.7; // More creative for hypothesis generation
  static readonly OPENAI_TEMPERATURE_REVIEW = 0.4; // Balanced for peer review
  static readonly OPENAI_MAX_TOKENS = 1000;

  // Research Settings
  static readonly DEFAULT_RESEARCH_FIELD = 'longevity';
  static readonly PAPER_SUMMARY_MAX_LENGTH = 500; // Truncate long summaries

  // Data Storage
  static readonly RESEARCH_LOG_FILE = './data/research_log.json';
  static readonly CONTRACT_CONFIG_FILE = './config/contract.json';

  /**
   * Validates that all required environment variables are set
   * @throws Error if required variables are missing
   */
  static validate(): void {
    const required = [
      { key: 'GAME_API_KEY', value: this.GAME_API_KEY },
      { key: 'OPENAI_API_KEY', value: this.OPENAI_API_KEY }
    ];

    const missing = required.filter(({ value }) => !value);

    if (missing.length > 0) {
      const missingKeys = missing.map(({ key }) => key).join(', ');
      throw new Error(
        `Missing required environment variables: ${missingKeys}\n` +
        'Please check your .env file and ensure all required keys are set.'
      );
    }
  }

  /**
   * Returns a summary of the current configuration (without exposing sensitive keys)
   */
  static summary(): string {
    return `
ScienceDAO Agent Configuration:
- GAME API Key: ${this.GAME_API_KEY ? '✓ Set' : '✗ Missing'}
- OpenAI API Key: ${this.OPENAI_API_KEY ? '✓ Set' : '✗ Missing'}
- Base RPC URL: ${this.BASE_RPC_URL ? '✓ Set' : '✗ Not Set'}
- Wallet Private Key: ${this.WALLET_PRIVATE_KEY ? '✓ Set' : '✗ Not Set'}
- Default Research Field: ${this.DEFAULT_RESEARCH_FIELD}
- arXiv Rate Limit: ${this.ARXIV_RATE_LIMIT_MS}ms
- OpenAI Model: ${this.OPENAI_MODEL}
    `.trim();
  }
}

// Validate configuration on import
try {
  Config.validate();
} catch (error) {
  console.warn('Configuration validation warning:', (error as Error).message);
}
