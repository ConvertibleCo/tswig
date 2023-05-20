import { deepMerge } from "../../index";

describe("deepMerge", () => {
  test("should return the source object if the target is not an object", () => {
    const source = { a: 1, b: 2 };
    const target = null;
    expect(deepMerge(target, source)).toEqual(source);
  });

  test("should return the source object if the target is an array", () => {
    const source = { a: 1, b: 2 };
    const target = [1, 2, 3];
    expect(deepMerge(target, source)).toEqual(source);
  });

  test("should merge flat objects", () => {
    const source = { a: 1, b: 2 };
    const target = { c: 3, d: 4 };
    expect(deepMerge(target, source)).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  test("should deep merge nested objects", () => {
    const source = { a: { b: { c: 1 } } };
    const target = { a: { b: { d: 2 } } };
    expect(deepMerge(target, source)).toEqual({ a: { b: { c: 1, d: 2 } } });
  });

  test("should merge arrays by concatenation", () => {
    const source = { a: [1, 2, 3] };
    const target = { a: [4, 5, 6] };
    expect(deepMerge(target, source)).toEqual({ a: [4, 5, 6, 1, 2, 3] });
  });

  test("should handle circular references", () => {
    const circularObj: any = { a: 1 };
    circularObj.circular = circularObj;

    const source = { b: 2, circular: circularObj };
    const target = { a: 1 };

    const result = deepMerge(target, source);
    expect(result.circular).toEqual({ a: 1, circular: result.circular });
    expect(result.circular.circular).toBe(result.circular);
  });

  test("should use the custom merge strategy if provided", () => {
    const customMerge = (key: string, targetVal: any, sourceVal: any) => {
      if (
        key === "custom" &&
        Array.isArray(targetVal) &&
        Array.isArray(sourceVal)
      ) {
        return targetVal.concat(sourceVal);
      }
      return undefined;
    };

    const source = { a: 1, custom: [1, 2, 3] };
    const target = { a: 2, custom: [4, 5, 6] };

    const expectedResult = { a: 1, custom: [4, 5, 6, 1, 2, 3] };
    expect(deepMerge(target, source, { customMerge })).toEqual(expectedResult);
  });

  test("should deep merge arrays containing objects", () => {
    const source = {
      a: [
        { id: 1, value: "source" },
        { id: 2, value: "source" },
      ],
    };
    const target = {
      a: [
        { id: 1, value: "target" },
        { id: 3, value: "target" },
      ],
    };

    const result = deepMerge(target, source);
    expect(result).toEqual({
      a: [
        { id: 1, value: "target" },
        { id: 3, value: "target" },
        { id: 1, value: "source" },
        { id: 2, value: "source" },
      ],
    });
  });

  test("should deep merge arrays containing objects and primitives", () => {
    const source = {
      a: [{ id: 1, value: "source" }, 2, "hello"],
    };
    const target = {
      a: [{ id: 1, value: "target" }, 3, "world"],
    };

    const result = deepMerge(target, source);
    expect(result).toEqual({
      a: [
        { id: 1, value: "target" },
        3,
        "world",
        { id: 1, value: "source" },
        2,
        "hello",
      ],
    });
  });

  test("should merge complex nested objects and arrays", () => {
    const source = {
      a: {
        b: {
          c: [1, 2, 3],
          d: {
            e: "source",
          },
        },
      },
    };
    const target = {
      a: {
        b: {
          c: [4, 5, 6],
          d: {
            f: "target",
          },
        },
      },
    };

    const result = deepMerge(target, source);
    expect(result).toEqual({
      a: {
        b: {
          c: [4, 5, 6, 1, 2, 3],
          d: {
            e: "source",
            f: "target",
          },
        },
      },
    });
  });

  test("should handle multiple levels of circular references", () => {
    const circularObj1: any = { a: 1 };
    circularObj1.circular = circularObj1;

    const circularObj2: any = { b: 2 };
    circularObj2.circular = circularObj2;

    const source = { c: 3, circular1: circularObj1 };
    const target = { d: 4, circular2: circularObj2 };

    const result = deepMerge(target, source);
    expect(result.circular1).toBe(result.circular1.circular);
    expect(result.circular2).toBe(result.circular2.circular);
  });

  test("should merge Date objects", () => {
    const sourceDate = new Date(2021, 0, 1);
    const targetDate = new Date(2020, 0, 1);
    const source = { date: sourceDate };
    const target = { date: targetDate };

    const result = deepMerge(target, source);
    expect(result.date).not.toBe(target.date);
    expect(result.date).not.toBe(source.date);
    expect(result.date).toEqual(source.date);
  });

  test("should merge RegExp objects", () => {
    const sourceRegExp = /source/gi;
    const targetRegExp = /target/g;
    const source = { regex: sourceRegExp };
    const target = { regex: targetRegExp };

    const result = deepMerge(target, source);
    expect(result.regex).not.toBe(target.regex);
    expect(result.regex).not.toBe(source.regex);
    expect(result.regex).toEqual(source.regex);
  });

  test("should merge Map objects", () => {
    const sourceMap = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    const targetMap = new Map([
      ["b", 3],
      ["c", 4],
    ]);
    const source = { map: sourceMap };
    const target = { map: targetMap };

    const expectedResultMap = new Map([
      ["a", 1],
      ["b", 2],
      ["c", 4],
    ]);

    const result = deepMerge(target, source);
    expect(result.map).not.toBe(target.map);
    expect(result.map).not.toBe(source.map);
    expect(result.map).toEqual(expectedResultMap);
  });

  test("should merge Set objects", () => {
    const sourceSet = new Set([1, 2]);
    const targetSet = new Set([2, 3]);
    const source = { set: sourceSet };
    const target = { set: targetSet };

    const expectedResultSet = new Set([1, 2, 3]);

    const result = deepMerge(target, source);
    expect(result.set).not.toBe(target.set);
    expect(result.set).not.toBe(source.set);
    expect(result.set).toEqual(expectedResultSet);
  });

  test("should merge objects with symbol properties", () => {
    const symbolA = Symbol("a");
    const symbolB = Symbol("b");
    const symbolC = Symbol("c");
    const source = { [symbolA]: 1, [symbolB]: 2 };
    const target = { [symbolB]: 3, [symbolA]: 4, [symbolC]: 5 };

    const result = deepMerge(target, source);
    expect(result[symbolA]).toBe(1);
    expect(result[symbolB]).toBe(2);
    expect(result[symbolC]).toBe(5);
  });
});
