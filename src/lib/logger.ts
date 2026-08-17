type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

class Logger {
  private format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const icon = {
      INFO: 'ℹ️',
      WARN: '⚠️',
      ERROR: '❌',
      DEBUG: '🔍',
    }[level];

    return `${icon} [${timestamp}] [${level}]: ${message}`;
  }

  info(message: string, ...args: unknown[]) {
    console.log(this.format('INFO', message), ...args);
  }

  warn(message: string, ...args: unknown[]) {
    console.warn(this.format('WARN', message), ...args);
  }

  error(message: string, error?: unknown, ...args: unknown[]) {
    console.error(this.format('ERROR', message), ...args);
    if (error instanceof Error) {
      console.error(error.stack);
    } else if (error) {
      console.error(error);
    }
  }

  debug(message: string, ...args: unknown[]) {
    // Only log debug messages in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.format('DEBUG', message), ...args);
    }
  }
}

export const logger = new Logger();
export default logger;
