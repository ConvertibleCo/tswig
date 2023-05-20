import * as ts from 'typescript';
import * as fs from 'fs';
import * as os from 'os';
import TypeScriptConfigBuilder from '../../ts-config-builder';
import { TypeScriptConfigBuilderError, FileSystemError } from '../../errors';

describe('TypeScriptConfigBuilder', () => {
  let readConfigFileSpy: jest.SpyInstance;
  let writeFileSyncSpy: jest.SpyInstance;
  let unlinkSyncSpy: jest.SpyInstance;
  let tmpdirSpy: jest.SpyInstance;
  let parseJsonSourceFileConfigFileContentSpy: jest.SpyInstance;

  beforeEach(() => {
    readConfigFileSpy = jest.spyOn(ts, 'readConfigFile');
    writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
    unlinkSyncSpy = jest.spyOn(fs, 'unlinkSync');
    tmpdirSpy = jest.spyOn(os, 'tmpdir');
    parseJsonSourceFileConfigFileContentSpy = jest.spyOn(ts, 'parseJsonSourceFileConfigFileContent');

    readConfigFileSpy.mockClear();
    writeFileSyncSpy.mockClear();
    unlinkSyncSpy.mockClear();
    tmpdirSpy.mockClear();
    parseJsonSourceFileConfigFileContentSpy.mockClear();
  });

  it('constructs with default parameters', () => {
    const builder = new TypeScriptConfigBuilder();
    expect(builder).toBeDefined();
  });

  it('constructs with config object parameter and creates temp file', () => {
    const config = { compilerOptions: { module: "commonjs", target: "es6", strict: true }};
    tmpdirSpy.mockReturnValue('/tmp');

    const builder = new TypeScriptConfigBuilder(config);
    expect(builder).toBeDefined();
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it('throws an error when writing the temporary file fails', () => {
    const config = { compilerOptions: { module: "commonjs", target: "es6", strict: true }};
    writeFileSyncSpy.mockImplementation(() => { throw new Error("Cannot write file") });

    expect(() => new TypeScriptConfigBuilder(config)).toThrow("Cannot write file");
  });

  it('constructs with config file name parameter', () => {
    const builder = new TypeScriptConfigBuilder('tsconfig.json');
    expect(builder).toBeDefined();
  });

  it('loadConfigurations returns parsed configurations', () => {
    const builder = new TypeScriptConfigBuilder();
    const options = builder.loadConfigurations();
    expect(options).toBeDefined();
    expect(typeof options).toBe('object');
  });

  it('getReferences returns parsed file references', () => {
    const builder = new TypeScriptConfigBuilder();
    const references = builder.getReferences();
    expect(references).toBeDefined();
    expect(Array.isArray(references)).toBe(true);
  });

  it('throws TypeScriptConfigBuilderError when reading the config file fails', () => {
    const builder = new TypeScriptConfigBuilder();
    readConfigFileSpy.mockImplementation(() => ({ error: { messageText: "Cannot read config file" } }));

    expect(() => builder.loadConfigurations()).toThrow(TypeScriptConfigBuilderError);
    expect(() => builder.getReferences()).toThrow(TypeScriptConfigBuilderError);
  });

  it('throws TypeScriptConfigBuilderError when parsing json config fails', () => {
    const builder = new TypeScriptConfigBuilder();
    parseJsonSourceFileConfigFileContentSpy.mockImplementation(() => { throw new Error("Cannot parse config file") });

    expect(() => builder.loadConfigurations()).toThrow(TypeScriptConfigBuilderError);
    expect(() => builder.getReferences()).toThrow(TypeScriptConfigBuilderError);
  });

  it('cleans up temporary file', () => {
    const config = { compilerOptions: { module: "commonjs", target: "es6", strict: true }};
    tmpdirSpy.mockReturnValue('/tmp');

    const builder = new TypeScriptConfigBuilder(config);
    builder.loadConfigurations();
    expect(unlinkSyncSpy).toHaveBeenCalled();
  });

  it('throws FileSystemError when cleaning up the temporary file fails', () => {
    const config = { compilerOptions: { module: "commonjs", target: "es6", strict: true }};
    tmpdirSpy.mockReturnValue('/tmp');
    unlinkSyncSpy.mockImplementation(() => { throw new Error("Cannot delete file") });

    const builder = new TypeScriptConfigBuilder(config);
    expect(() => builder.loadConfigurations()).toThrow(FileSystemError);
  });
});
