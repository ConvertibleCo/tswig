class Logger {
  private static verbose: boolean = process.env["TSWIG_VERBOSE"] === "true";

  static info(message: string): void {
    if (Logger.verbose) {
      console.info(message);
    }
  }

  static error(message: string): void {
    console.error(message);
  }

  static warn(message: string): void {
    if (Logger.verbose) {
      console.warn(message);
    }
  }
}

export default Logger;
