/**
 * Custom error class for SwcConfigBuilder override errors.
 */
class SWCOverrideError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SWCOverrideError";
  }
}

export default SWCOverrideError;
