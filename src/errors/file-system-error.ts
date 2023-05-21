import TypeScriptConfigBuilderError from "./ts-cconfig-builder-error";
class FileSystemError extends TypeScriptConfigBuilderError {
  constructor(message?: string) {
    super(message);
    this.name = "TypeScriptConfigBuilderFileSystemError";
  }
}

export default FileSystemError;