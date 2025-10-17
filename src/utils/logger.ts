import fs from 'fs';
import path from 'path';
import { Config } from './config';

/**
 * Activity types for research logging
 */
export enum ActivityType {
  PAPER_FETCH = 'PAPER_FETCH',
  PAPER_ANALYSIS = 'PAPER_ANALYSIS',
  HYPOTHESIS_GENERATION = 'HYPOTHESIS_GENERATION',
  PEER_REVIEW = 'PEER_REVIEW',
  DATA_CURATION = 'DATA_CURATION',
  PROPOSAL_CREATION = 'PROPOSAL_CREATION',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: string;
  type: ActivityType;
  message: string;
  data?: any;
  agent?: string;
}

/**
 * Research Activity Logger
 * Logs all agent activities to file and console for transparency
 */
export class Logger {
  private static logFile: string = Config.RESEARCH_LOG_FILE;
  private static logs: LogEntry[] = [];

  /**
   * Initialize logger and ensure data directory exists
   */
  static init(): void {
    const dataDir = path.dirname(this.logFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Load existing logs if file exists
    if (fs.existsSync(this.logFile)) {
      try {
        const content = fs.readFileSync(this.logFile, 'utf-8');
        this.logs = JSON.parse(content);
      } catch (error) {
        console.warn('Could not load existing logs:', (error as Error).message);
        this.logs = [];
      }
    }
  }

  /**
   * Log an activity
   */
  static log(type: ActivityType, message: string, data?: any, agent?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data,
      agent
    };

    this.logs.push(entry);
    this.writeToFile();
    this.logToConsole(entry);
  }

  /**
   * Log info message
   */
  static info(message: string, data?: any): void {
    this.log(ActivityType.INFO, message, data);
  }

  /**
   * Log error message
   */
  static error(message: string, error?: any): void {
    this.log(ActivityType.ERROR, message, error);
  }

  /**
   * Log paper fetch activity
   */
  static paperFetch(topic: string, count: number): void {
    this.log(
      ActivityType.PAPER_FETCH,
      `Fetched ${count} papers on topic: ${topic}`,
      { topic, count }
    );
  }

  /**
   * Log paper analysis activity
   */
  static paperAnalysis(paperTitle: string, findings: any): void {
    this.log(
      ActivityType.PAPER_ANALYSIS,
      `Analyzed paper: ${paperTitle}`,
      { paperTitle, findings }
    );
  }

  /**
   * Log hypothesis generation
   */
  static hypothesisGeneration(hypothesis: string, scores: any): void {
    this.log(
      ActivityType.HYPOTHESIS_GENERATION,
      `Generated hypothesis`,
      { hypothesis, scores }
    );
  }

  /**
   * Log peer review activity
   */
  static peerReview(hypothesisId: string, review: any): void {
    this.log(
      ActivityType.PEER_REVIEW,
      `Peer review completed for hypothesis: ${hypothesisId}`,
      { hypothesisId, review },
      'PeerReviewAgent'
    );
  }

  /**
   * Log data curation activity
   */
  static dataCuration(hypothesisId: string, datasets: any[]): void {
    this.log(
      ActivityType.DATA_CURATION,
      `Found ${datasets.length} datasets for hypothesis: ${hypothesisId}`,
      { hypothesisId, datasets },
      'DataCuratorAgent'
    );
  }

  /**
   * Log proposal creation
   */
  static proposalCreation(proposalId: string, txHash: string): void {
    this.log(
      ActivityType.PROPOSAL_CREATION,
      `Created on-chain proposal: ${proposalId}`,
      { proposalId, txHash }
    );
  }

  /**
   * Write logs to file
   */
  private static writeToFile(): void {
    try {
      fs.writeFileSync(
        this.logFile,
        JSON.stringify(this.logs, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Failed to write logs to file:', (error as Error).message);
    }
  }

  /**
   * Log to console with colors
   */
  private static logToConsole(entry: LogEntry): void {
    const colors = {
      [ActivityType.PAPER_FETCH]: '\x1b[36m', // Cyan
      [ActivityType.PAPER_ANALYSIS]: '\x1b[35m', // Magenta
      [ActivityType.HYPOTHESIS_GENERATION]: '\x1b[33m', // Yellow
      [ActivityType.PEER_REVIEW]: '\x1b[34m', // Blue
      [ActivityType.DATA_CURATION]: '\x1b[32m', // Green
      [ActivityType.PROPOSAL_CREATION]: '\x1b[32m', // Green
      [ActivityType.ERROR]: '\x1b[31m', // Red
      [ActivityType.INFO]: '\x1b[37m' // White
    };

    const reset = '\x1b[0m';
    const color = colors[entry.type] || reset;
    const time = new Date(entry.timestamp).toLocaleTimeString();
    const agent = entry.agent ? `[${entry.agent}] ` : '';

    console.log(
      `${color}[${time}] [${entry.type}] ${agent}${entry.message}${reset}`
    );

    if (entry.data && entry.type === ActivityType.ERROR) {
      console.error(entry.data);
    }
  }

  /**
   * Get all logs
   */
  static getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Get logs by type
   */
  static getLogsByType(type: ActivityType): LogEntry[] {
    return this.logs.filter(log => log.type === type);
  }

  /**
   * Get recent logs (last N entries)
   */
  static getRecentLogs(count: number = 10): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all logs
   */
  static clear(): void {
    this.logs = [];
    this.writeToFile();
  }

  /**
   * Get statistics
   */
  static getStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};

    Object.values(ActivityType).forEach(type => {
      stats[type] = this.logs.filter(log => log.type === type).length;
    });

    return stats;
  }
}

// Initialize logger on import
Logger.init();
