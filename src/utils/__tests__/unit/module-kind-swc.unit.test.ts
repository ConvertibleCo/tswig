import ts from "typescript";
import moduleKindToSWC from "../../module-kind-to-swc";
describe("moduleKindToSWC", () => {
  it("should return 'amd' when moduleKind is ts.ModuleKind.AMD", () => {
    expect(moduleKindToSWC(ts.ModuleKind.AMD)).toBe("amd");
  });

  it("should return 'umd' when moduleKind is ts.ModuleKind.UMD", () => {
    expect(moduleKindToSWC(ts.ModuleKind.UMD)).toBe("umd");
  });

  it("should return 'systemjs' when moduleKind is ts.ModuleKind.System", () => {
    expect(moduleKindToSWC(ts.ModuleKind.System)).toBe("systemjs");
  });

  it("should return 'es6' when moduleKind is ts.ModuleKind.ES2015", () => {
    expect(moduleKindToSWC(ts.ModuleKind.ES2015)).toBe("es6");
  });

  it("should return 'nodenext' when moduleKind is ts.ModuleKind.ES2020", () => {
    expect(moduleKindToSWC(ts.ModuleKind.ES2020)).toBe("nodenext");
  });

  it("should return 'nodenext' when moduleKind is ts.ModuleKind.ESNext", () => {
    expect(moduleKindToSWC(ts.ModuleKind.ESNext)).toBe("nodenext");
  });

  it("should return 'commonjs' when moduleKind is ts.ModuleKind.None", () => {
    expect(moduleKindToSWC(ts.ModuleKind.None)).toBe("commonjs");
  });

  it("should return 'commonjs' when moduleKind is ts.ModuleKind.CommonJS", () => {
    expect(moduleKindToSWC(ts.ModuleKind.CommonJS)).toBe("commonjs");
  });

  it("should return 'commonjs' when moduleKind is undefined", () => {
    expect(moduleKindToSWC(undefined)).toBe("commonjs");
  });
});
