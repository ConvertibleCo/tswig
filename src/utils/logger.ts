/**
 * Logger class for handling logging operations.
 */
class Logger {
  /**
   * Flag indicating whether the logger is in verbose mode.
   */
  private static verbose: boolean = process.env["TSWIG_VERBOSE"] === "true";

  /**
   * Logs an informational message.
   * @param {string} message - The message to be logged.
   */
  static info(message: string): void {
    if (Logger.verbose) {
      console.info(message);
    }
  }

  /**
   * Logs an error message.
   * @param {string} message - The error message to be logged.
   */
  static error(message: string): void {
    if (Logger.verbose) {
      console.error(message);
    }
  }

  /**
   * Logs a warning message.
   * @param {string} message - The warning message to be logged.
   */
  static warn(message: string): void {
    if (Logger.verbose) {
      console.warn(message);
    }
  }
}

export default Logger;
