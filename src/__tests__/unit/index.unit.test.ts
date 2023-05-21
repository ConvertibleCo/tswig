import { convert } from "../../index";
import TypeScriptConfigBuilder from "../../ts-config-builder";
import SwcConfigBuilder from "../../swc-config-builder";

jest.mock("../../ts-config-builder");
jest.mock("../../swc-config-builder", () => {
  return {
    fromTsConfig: jest.fn(() => {
      return {
        overrides: jest.fn(),
      };
    }),
  };
});

describe("convert function unit tests", () => {
  const tsconfigString = "tsconfig.json";
  const tsconfigObject = { /* your TS configuration as an object */ };
  const swcOptionsObject = { /* your SWC options as an object */ };

  let fromTsConfigSpy: jest.SpyInstance;
  let loadConfigurationsSpy: jest.SpyInstance;

  beforeEach(() => {
    fromTsConfigSpy = jest.spyOn(SwcConfigBuilder, "fromTsConfig");
    loadConfigurationsSpy = jest.spyOn(TypeScriptConfigBuilder.prototype, "loadConfigurations");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should load configurations when tsconfig is a string", () => {
    convert({ tsconfig: tsconfigString });

    expect(loadConfigurationsSpy).toHaveBeenCalledTimes(1);
  });

  it("should call loadConfigurations when tsconfig is an object", () => {
    convert({ tsconfig: tsconfigObject });

    expect(loadConfigurationsSpy).toHaveBeenCalledTimes(1);
  });

  it("should call fromTsConfig when tsconfig is an object", () => {
    loadConfigurationsSpy.mockReturnValue(tsconfigObject);
    convert({ tsconfig: tsconfigObject });


    expect(fromTsConfigSpy).toHaveBeenCalledWith(tsconfigObject);
  });

  it("should call overrides when swcOptions is passed", () => {
    convert({ swcOptions: swcOptionsObject });

    expect(fromTsConfigSpy).toHaveBeenCalled();

    const swcConfigBuilder = fromTsConfigSpy.mock.results[0]?.value;
    expect(swcConfigBuilder?.overrides).toHaveBeenCalledWith(swcOptionsObject);
  });

  it("should handle both tsconfig and swcOptions as objects", () => {
    convert({ tsconfig: tsconfigObject, swcOptions: swcOptionsObject });

    expect(loadConfigurationsSpy).toHaveBeenCalledTimes(1);
    expect(fromTsConfigSpy).toHaveBeenCalledWith(tsconfigObject);

    const swcConfigBuilder = fromTsConfigSpy.mock.results[0]?.value;
    expect(swcConfigBuilder?.overrides).toHaveBeenCalledWith(swcOptionsObject);
  });
});
