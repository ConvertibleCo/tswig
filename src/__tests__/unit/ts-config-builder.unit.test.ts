import * as ts from "typescript";
import * as fs from "fs";
import * as os from "os";
import TypeScriptConfigBuilder from "../../ts-config-builder";
import { TypeScriptConfigBuilderError, FileSystemError } from "../../errors";

jest.mock("typescript", () => ({
  __esModule: true,
  ...jest.requireActual("typescript"),
}));

jest.mock("fs", () => ({
  __esModule: true,
  ...jest.requireActual("fs"),
}));

jest.mock("os", () => ({
  __esModule: true,
  ...jest.requireActual("os"),
}));

describe("TypeScriptConfigBuilder", () => {

  let readConfigFileSpy: jest.SpyInstance;
  let writeFileSyncSpy: jest.SpyInstance;
  let unlinkSyncSpy: jest.SpyInstance;
  let tmpdirSpy: jest.SpyInstance;
  let parseJsonSourceFileConfigFileContentSpy: jest.SpyInstance;

  beforeEach(() => {
    readConfigFileSpy = jest.spyOn(ts, "readConfigFile");
    writeFileSyncSpy = jest.spyOn(fs, "writeFileSync");
    unlinkSyncSpy = jest.spyOn(fs, "unlinkSync");
    tmpdirSpy = jest.spyOn(os, "tmpdir");
    parseJsonSourceFileConfigFileContentSpy = jest.spyOn(ts, "parseJsonSourceFileConfigFileContent");
  });

  afterEach(() => {
    readConfigFileSpy.mockClear();
    writeFileSyncSpy.mockClear();
    unlinkSyncSpy.mockClear();
    tmpdirSpy.mockClear();
    parseJsonSourceFileConfigFileContentSpy.mockClear();
  });

  it("constructs with default parameters", () => {
    const builder = new TypeScriptConfigBuilder();
    expect(builder).toBeDefined();
  });

  it("constructs with config object parameter and creates temp file", () => {
    const config = { compilerOptions: { module: "commonjs", target: "es6", strict: true }};
    tmpdirSpy.mockReturnValue("/tmp");

    const builder = new TypeScriptConfigBuilder(config);
    expect(builder).toBeDefined();
    expect(tmpdirSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it("throws an error when writing the temporary file fails", () => {
    const config = { compilerOptions: { module: "commonjs", target: "es6", strict: true }};
    writeFileSyncSpy.mockImplementation(() => { throw new Error("Cannot write file"); });

    expect(() => new TypeScriptConfigBuilder(config)).toThrow("Cannot write file");
  });

  it("constructs with config file name parameter", () => {
    const builder = new TypeScriptConfigBuilder("tsconfig.json");
    expect(builder).toBeDefined();
  });

  it("loadConfigurations returns parsed configurations", () => {
    const builder = new TypeScriptConfigBuilder();

    const parsedConfig = {
      options: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2016,
        strict: true,
      },
    };

    parseJsonSourceFileConfigFileContentSpy.mockReturnValue(parsedConfig);

    const options = builder.loadConfigurations();

    expect(options).toBeDefined();
    expect(typeof options).toBe("object");
    expect(options.module).toBe(ts.ModuleKind.CommonJS);
    expect(options.target).toBe(ts.ScriptTarget.ES2016);
    expect(options.strict).toBe(true);
  });

  it("getReferences returns parsed file references", () => {
    const builder = new TypeScriptConfigBuilder();

    const mockConfig = {
      options: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2016,
        strict: true,
      },
      fileNames: [
        "src/file1.ts",
        "src/file2.ts",
      ],
      projectReferences: [
        {
          path: "path/to/reference1",
          originalPath: "path/to/reference1",
        },
        {
          path: "path/to/reference2",
          originalPath: "path/to/reference2",
        },
      ],
    };

    parseJsonSourceFileConfigFileContentSpy.mockReturnValue(mockConfig);

    const references = builder.getReferences();

    expect(references).toBeDefined();
    expect(Array.isArray(references)).toBe(true);
    expect(references).toEqual(["src/file1.ts", "src/file2.ts"]);
  });


  it("throws TypeScriptConfigBuilderError when reading the config file fails", () => {
    const builder = new TypeScriptConfigBuilder();
    readConfigFileSpy.mockImplementation(() => ({ error: { messageText: "Cannot read config file" } }));

    expect(() => builder.loadConfigurations()).toThrow(TypeScriptConfigBuilderError);
    expect(() => builder.getReferences()).toThrow(TypeScriptConfigBuilderError);
  });

  it("throws TypeScriptConfigBuilderError when parsing json config fails", () => {
    const builder = new TypeScriptConfigBuilder();
    parseJsonSourceFileConfigFileContentSpy.mockImplementation(() => { throw new Error("Cannot parse config file"); });

    expect(() => builder.loadConfigurations()).toThrow(TypeScriptConfigBuilderError);
    expect(() => builder.getReferences()).toThrow(TypeScriptConfigBuilderError);
  });

  it("cleans up temporary file", () => {
    const config = { compilerOptions: { module: "commonjs", target: "es6", strict: true }};

    tmpdirSpy.mockReturnValue("/tmp");

    writeFileSyncSpy.mockImplementation(() => { return "tmpfile" });

    readConfigFileSpy.mockImplementation(() => ({ config: config }));

    const parsedConfig = {
      options: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2016,
        strict: true,
      },
    };

    parseJsonSourceFileConfigFileContentSpy.mockReturnValue(parsedConfig);

    unlinkSyncSpy.mockImplementation(() => { return "tmpfile" })

    const builder = new TypeScriptConfigBuilder(config);
    builder.loadConfigurations();
    expect(unlinkSyncSpy).toHaveBeenCalled();
  });

  it("throws FileSystemError when cleaning up the temporary file fails", () => {
    const config = { compilerOptions: { module: "commonjs", target: "es6", strict: true }};
    tmpdirSpy.mockReturnValue("/tmp");
    unlinkSyncSpy.mockImplementation(() => { throw new Error("Cannot delete file"); });
    writeFileSyncSpy.mockImplementation(() => { return "tmpfile" });
    const parsedConfig = {
      options: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2016,
        strict: true,
      },
    };

    parseJsonSourceFileConfigFileContentSpy.mockReturnValue(parsedConfig);


    const builder = new TypeScriptConfigBuilder(config);
    expect(() => builder.loadConfigurations()).toThrow(FileSystemError);
  });
});
