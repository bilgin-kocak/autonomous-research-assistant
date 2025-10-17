import fs from 'fs';
import path from 'path';
import { Config } from './config';

/**
 * Log levels for enhanced logging
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

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
  API_CALL = 'API_CALL',
  PERFORMANCE = 'PERFORMANCE',
  ERROR = 'ERROR',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  WARNING = 'WARNING'
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
  level?: LogLevel;
  duration?: number;
}

/**
 * API call metrics
 */
export interface APIMetrics {
  endpoint: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  lastCallTime?: Date;
  lastError?: string;
}

/**
 * Performance metrics entry
 */
export interface PerformanceEntry {
  operation: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  metadata?: any;
}

/**
 * Research Activity Logger
 * Logs all agent activities to file and console for transparency
 *
 * Day 4 Enhancements:
 * - Debug logging with configurable log levels
 * - API call tracking and metrics
 * - Performance profiling
 * - Enhanced console formatting
 */
export class Logger {
  private static logFile: string = Config.RESEARCH_LOG_FILE;
  private static logs: LogEntry[] = [];
  private static currentLogLevel: LogLevel = LogLevel.INFO;
  private static apiMetrics: Map<string, APIMetrics> = new Map();
  private static performanceEntries: PerformanceEntry[] = [];
  private static debugMode: boolean = process.env.DEBUG === 'true';

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
   * Set log level
   */
  static setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
  }

  /**
   * Enable/disable debug mode
   */
  static setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Check if log level should be output
   */
  private static shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARNING, LogLevel.ERROR];
    const currentIndex = levels.indexOf(this.currentLogLevel);
    const messageIndex = levels.indexOf(level);
    return messageIndex >= currentIndex;
  }

  /**
   * Log an activity
   */
  static log(
    type: ActivityType,
    message: string,
    data?: any,
    agent?: string,
    level?: LogLevel,
    duration?: number
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data,
      agent,
      level: level || LogLevel.INFO,
      duration
    };

    this.logs.push(entry);
    this.writeToFile();

    // Only log to console if level is appropriate
    if (this.shouldLog(entry.level!)) {
      this.logToConsole(entry);
    }
  }

  /**
   * Log debug message
   */
  static debug(message: string, data?: any): void {
    if (this.debugMode) {
      this.log(ActivityType.DEBUG, message, data, undefined, LogLevel.DEBUG);
    }
  }

  /**
   * Log info message
   */
  static info(message: string, data?: any): void {
    this.log(ActivityType.INFO, message, data, undefined, LogLevel.INFO);
  }

  /**
   * Log warning message
   */
  static warning(message: string, data?: any): void {
    this.log(ActivityType.WARNING, message, data, undefined, LogLevel.WARNING);
  }

  /**
   * Log error message
   */
  static error(message: string, error?: any): void {
    this.log(ActivityType.ERROR, message, error, undefined, LogLevel.ERROR);
  }

  /**
   * Track API call
   */
  static trackAPICall(
    endpoint: string,
    duration: number,
    success: boolean,
    error?: string
  ): void {
    // Update metrics
    let metrics = this.apiMetrics.get(endpoint);
    if (!metrics) {
      metrics = {
        endpoint,
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        averageResponseTime: 0,
        lastCallTime: new Date()
      };
      this.apiMetrics.set(endpoint, metrics);
    }

    metrics.totalCalls++;
    if (success) {
      metrics.successfulCalls++;
    } else {
      metrics.failedCalls++;
      metrics.lastError = error;
    }

    metrics.averageResponseTime =
      (metrics.averageResponseTime * (metrics.totalCalls - 1) + duration) /
      metrics.totalCalls;
    metrics.lastCallTime = new Date();

    // Log the API call
    this.log(
      ActivityType.API_CALL,
      `API call to ${endpoint}: ${success ? 'SUCCESS' : 'FAILED'} (${duration}ms)`,
      { endpoint, duration, success, error },
      undefined,
      success ? LogLevel.DEBUG : LogLevel.WARNING,
      duration
    );
  }

  /**
   * Track performance of an operation
   */
  static trackPerformance(
    operation: string,
    duration: number,
    success: boolean,
    metadata?: any
  ): void {
    const entry: PerformanceEntry = {
      operation,
      duration,
      timestamp: new Date(),
      success,
      metadata
    };

    this.performanceEntries.push(entry);

    // Keep only last 100 entries
    if (this.performanceEntries.length > 100) {
      this.performanceEntries.shift();
    }

    this.log(
      ActivityType.PERFORMANCE,
      `Operation '${operation}' completed in ${duration}ms`,
      { operation, duration, success, metadata },
      undefined,
      LogLevel.DEBUG,
      duration
    );
  }

  /**
   * Get API metrics
   */
  static getAPIMetrics(): Map<string, APIMetrics> {
    return this.apiMetrics;
  }

  /**
   * Get API metrics summary
   */
  static getAPIMetricsSummary(): any {
    const summary: any = {};
    this.apiMetrics.forEach((metrics, endpoint) => {
      summary[endpoint] = {
        totalCalls: metrics.totalCalls,
        successRate: `${Math.round((metrics.successfulCalls / metrics.totalCalls) * 100)}%`,
        averageResponseTime: `${metrics.averageResponseTime.toFixed(0)}ms`,
        lastCallTime: metrics.lastCallTime?.toISOString(),
        lastError: metrics.lastError
      };
    });
    return summary;
  }

  /**
   * Get performance summary
   */
  static getPerformanceSummary(): any {
    const summary: any = {};

    this.performanceEntries.forEach(entry => {
      if (!summary[entry.operation]) {
        summary[entry.operation] = {
          count: 0,
          totalDuration: 0,
          successCount: 0,
          failCount: 0
        };
      }

      const op = summary[entry.operation];
      op.count++;
      op.totalDuration += entry.duration;
      if (entry.success) {
        op.successCount++;
      } else {
        op.failCount++;
      }
    });

    // Calculate averages
    Object.keys(summary).forEach(key => {
      const op = summary[key];
      op.averageDuration = `${(op.totalDuration / op.count).toFixed(0)}ms`;
      op.successRate = `${Math.round((op.successCount / op.count) * 100)}%`;
      delete op.totalDuration;
    });

    return summary;
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
      [ActivityType.API_CALL]: '\x1b[90m', // Dark Gray
      [ActivityType.PERFORMANCE]: '\x1b[96m', // Bright Cyan
      [ActivityType.ERROR]: '\x1b[31m', // Red
      [ActivityType.INFO]: '\x1b[37m', // White
      [ActivityType.DEBUG]: '\x1b[90m', // Dark Gray
      [ActivityType.WARNING]: '\x1b[93m' // Bright Yellow
    };

    const reset = '\x1b[0m';
    const color = colors[entry.type] || reset;
    const time = new Date(entry.timestamp).toLocaleTimeString();
    const agent = entry.agent ? `[${entry.agent}] ` : '';
    const duration = entry.duration ? ` (${entry.duration}ms)` : '';

    console.log(
      `${color}[${time}] [${entry.type}] ${agent}${entry.message}${duration}${reset}`
    );

    if (entry.data && (entry.type === ActivityType.ERROR || this.debugMode)) {
      if (entry.type === ActivityType.ERROR) {
        console.error(entry.data);
      } else {
        console.log(entry.data);
      }
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
