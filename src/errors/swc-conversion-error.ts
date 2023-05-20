/**
 * Custom error class for SwcConfigBuilder conversion errors.
 */
class SWCConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SWCConversionError";
  }
}

export default SWCConversionError;
