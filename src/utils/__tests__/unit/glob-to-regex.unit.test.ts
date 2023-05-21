import globToRegex from "../../glob-to-regex";

describe("globToRegex", () => {
  it("converts basic glob patterns to regex", () => {
    expect(globToRegex("*.txt")).toEqual(/^[^/]*\.txt$/i);
    expect(globToRegex("file?.js")).toEqual(/^file[^/]\.js$/i);
    expect(globToRegex("directory/*/file.*")).toEqual(/^directory\/[^/]*\/file\.[^/]*$/i);
  });

  it("converts glob patterns with double wildcards to regex", () => {
    expect(globToRegex("directory/**/*.js")).toEqual(/^directory\/[^/]*[^/]*\/[^/]*\.js$/i);
    expect(globToRegex("directory/**/file.*")).toEqual(/^directory\/[^/]*[^/]*\/file\.[^/]*$/i);
  });

  it("handles glob patterns with excluded directories", () => {
    expect(globToRegex("node_modules")).toEqual(/^node_modules$/i);
    expect(globToRegex("directory/**/__tests__/*.test.ts")).toEqual(/^directory\/[^/]*[^/]*\/__tests__\/[^/]*\.test\.ts$/i);
  });

  it("escapes special characters in glob patterns", () => {
    expect(globToRegex("file?.txt")).toEqual(/^file[^/]\.txt$/i);
    expect(globToRegex("path/to/folder[]")).toEqual(/^path\/to\/folder\[\]$/i);
  });

  it("handles case-insensitive matching", () => {
    expect(globToRegex("*.txt")).toEqual(/^[^/]*\.txt$/i);
    expect(globToRegex("FOLDER/**/*.js")).toEqual(/^FOLDER\/[^/]*[^/]*\/[^/]*\.js$/i);
  });

  it("handles complex glob patterns", () => {
    expect(globToRegex("**/dir?/*.md")).toEqual(/^[^/]*[^/]*\/dir[^/]\/[^/]*\.md$/i);
    expect(globToRegex("test/[ab]cd?")).toEqual(/^test\/\[ab\]cd[^/]$/i);
  });

  it("handles edge cases", () => {
    expect(globToRegex("")).toEqual(/^$/i);
    expect(globToRegex("*")).toEqual(/^[^/]*$/i);
    expect(globToRegex("**")).toEqual(/^[^/]*[^/]*$/i);
    expect(globToRegex("?")).toEqual(/^[^/]$/i);
    expect(globToRegex("/directory/file.js")).toEqual(/^\/directory\/file\.js$/i);
    expect(globToRegex("directory/")).toEqual(/^directory\/$/i);
    expect(globToRegex("**/")).toEqual(/^[^/]*[^/]*\/$/i);
  });

  it("handles patterns with repeated characters", () => {
    expect(globToRegex("aaa")).toEqual(/^aaa$/i);
    expect(globToRegex("a*b*c")).toEqual(/^a[^/]*b[^/]*c$/i);
    expect(globToRegex("?a?b?c?")).toEqual(/^[^/]a[^/]b[^/]c[^/]$/i);
  });

  it("handles patterns with escaped characters", () => {
    expect(globToRegex("file\\?\\.txt")).toEqual(/^file\\[^/]\\\.txt$/i);
    expect(globToRegex("path\\/to\\/folder")).toEqual(/^path\\\/to\\\/folder$/i);
  });

  it("handles patterns with multiple wildcards", () => {
    expect(globToRegex("**/*.js")).toEqual( /^[^/]*[^/]*\/[^/]*\.js$/i);
    expect(globToRegex("**/test/**/*.spec.js")).toEqual(/^[^/]*[^/]*\/test\/[^/]*[^/]*\/[^/]*\.spec\.js$/i);
  });
});
