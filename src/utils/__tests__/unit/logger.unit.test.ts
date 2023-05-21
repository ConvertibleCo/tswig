describe("Logger", () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  const originalEnv = process.env;

  beforeEach(() => {
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    process.env = originalEnv;
  });

  describe("info", () => {
    it("should log message to console.info when verbose is true", async () => {
      process.env["TSWIG_VERBOSE"] = "true";
      const Logger = (await import("../../logger")).default
      Logger.info("test message");
      expect(consoleInfoSpy).toHaveBeenCalledWith("test message");
    });

    it("should not log message to console.info when verbose is false", async () => {
      process.env["TSWIG_VERBOSE"] = "false";
      const Logger = (await import("../../logger")).default
      Logger.info("test message");
      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });
  });

  describe("error", () => {
    it("should log message to console.error when verbose is true", async () => {
      process.env["TSWIG_VERBOSE"] = "true";
      const Logger = (await import("../../logger")).default
      Logger.error("test message");
      expect(consoleErrorSpy).toHaveBeenCalledWith("test message");
    });

    it("should log message to console.error when verbose is false", async () => {
      process.env["TSWIG_VERBOSE"] = "false";
      const Logger = (await import("../../logger")).default
      Logger.error("test message");
      expect(consoleErrorSpy).not.toHaveBeenCalledWith("test message");
    });
  });

  describe("warn", () => {
    it("should log message to console.warn when verbose is true", async () => {
      process.env["TSWIG_VERBOSE"] = "true";
      const Logger = (await import("../../logger")).default
      Logger.warn("test message");
      expect(consoleWarnSpy).toHaveBeenCalledWith("test message");
    });

    it("should not log message to console.warn when verbose is false", async () => {
      process.env["TSWIG_VERBOSE"] = "false";
      const Logger = (await import("../../logger")).default
      Logger.warn("test message");
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
