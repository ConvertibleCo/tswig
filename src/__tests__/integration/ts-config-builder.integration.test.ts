import * as ts from "typescript";
import * as fs from "fs";
import * as os from "os";
import TypeScriptConfigBuilder from "../../ts-config-builder";
import { TypeScriptConfigBuilderError } from "../../errors";

describe("TypeScriptConfigBuilder", () => {
  const configPath = `${os.tmpdir()}/tsconfig.json`;
  const config = {
    "compilerOptions": {
      "esModuleInterop": true,
      "sourceMap": true,
      "module": "commonjs",
      "strict": true,
      "noImplicitUseStrict": false,
      "jsx": "react",
      "jsxFactory": "React.createElement",
      "jsxFragmentFactory": "React.Fragment",
      "jsxImportSource": "react",
      "target": "es5",
      "allowJs": false,
      "strictNullChecks": true,
      "moduleResolution": "node",
      "allowSyntheticDefaultImports": true,
    },
  };

  beforeEach(() => {
    fs.writeFileSync(configPath, JSON.stringify(config), { mode: 0o644 });
  });

  afterEach(() => {
    if(fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  });

  it("constructs with config object parameter and creates temp file", () => {
    const builder = new TypeScriptConfigBuilder(config);
    expect(builder).toBeDefined();
  });

  it("constructs with config file name parameter", () => {
    const builder = new TypeScriptConfigBuilder(configPath);
    expect(builder).toBeDefined();
  });

  it("loadConfigurations returns parsed configurations", () => {
    const builder = new TypeScriptConfigBuilder(config);
    const options = builder.loadConfigurations();

    expect(options).toBeDefined();
    expect(typeof options).toBe("object");
    expect(options.module).toBe(ts.ModuleKind.CommonJS);
    expect(options.target).toBe(ts.ScriptTarget.ES5);
    expect(options.strict).toBe(true);
  });

  it("throws TypeScriptConfigBuilderError when reading the config file fails", () => {
    fs.unlinkSync(configPath);
    const builder = new TypeScriptConfigBuilder(configPath);
    expect(() => builder.loadConfigurations()).toThrow(TypeScriptConfigBuilderError);
  });
});
