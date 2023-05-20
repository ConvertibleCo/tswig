import ts from "typescript";
import scriptTargetToSWC from "../../script-target-to-swc";
describe("scriptTargetToSWC", () => {
  it("should return 'es3' when scriptTarget is ts.ScriptTarget.ES3", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ES3)).toBe("es3");
  });

  it("should return 'es5' when scriptTarget is ts.ScriptTarget.ES5", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ES5)).toBe("es5");
  });

  it("should return 'es2015' when scriptTarget is ts.ScriptTarget.ES2015", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ES2015)).toBe("es2015");
  });

  it("should return 'es2016' when scriptTarget is ts.ScriptTarget.ES2016", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ES2016)).toBe("es2016");
  });

  it("should return 'es2017' when scriptTarget is ts.ScriptTarget.ES2017", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ES2017)).toBe("es2017");
  });

  it("should return 'es2018' when scriptTarget is ts.ScriptTarget.ES2018", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ES2018)).toBe("es2018");
  });

  it("should return 'es2019' when scriptTarget is ts.ScriptTarget.ES2019", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ES2019)).toBe("es2019");
  });

  it("should return 'es2020' when scriptTarget is ts.ScriptTarget.ES2020", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ES2020)).toBe("es2020");
  });

  it("should return 'es2021' when scriptTarget is ts.ScriptTarget.ES2021", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ES2021)).toBe("es2021");
  });

  it("should return 'es2022' when scriptTarget is ts.ScriptTarget.ES2022", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ES2022)).toBe("es2022");
  });

  it("should return 'esnext' when scriptTarget is ts.ScriptTarget.ESNext", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.ESNext)).toBe("esnext");
  });

  it("should return 'esnext' when scriptTarget is ts.ScriptTarget.Latest", () => {
    expect(scriptTargetToSWC(ts.ScriptTarget.Latest)).toBe("esnext");
  });

  it("should return 'esnext' when scriptTarget is undefined", () => {
    expect(scriptTargetToSWC(undefined)).toBe("esnext");
  });
});
