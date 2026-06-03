type LogLevel = "info" | "warn" | "error" | "debug";

type LogContext = Record<string, unknown>;

function log(level: LogLevel, message: string, context?: LogContext) {
  const payload = context ? { message, ...context } : { message };

  switch (level) {
    case "error":
      console.error(`[${level}]`, payload);
      break;
    case "warn":
      console.warn(`[${level}]`, payload);
      break;
    case "debug":
      if (process.env.NODE_ENV !== "production") {
        console.debug(`[${level}]`, payload);
      }
      break;
    default:
      console.info(`[${level}]`, payload);
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => log("error", message, context),
  debug: (message: string, context?: LogContext) => log("debug", message, context),
};
