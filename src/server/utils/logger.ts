/**
 * @module logger
 * @description Service de logging simple et typé
 * Principe SRP : responsabilité unique de logging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private format(entry: LogEntry): string {
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.context}] ${entry.message}${entry.data ? ' | Data: ' + JSON.stringify(entry.data) : ''}`;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      data,
    };

    const formatted = this.format(entry);

    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'debug':
        console.debug(formatted);
        break;
      default:
        console.log(formatted);
    }
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }
}

/** Factory pour créer des loggers contextuels */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

export { Logger };
