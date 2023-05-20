/**
 * Checks if a value is a non-null object.
 * @param {any} item - The value to check.
 * @returns {boolean} - Returns true if the value is a non-null object, false otherwise.
 */
function isObject(item: any): item is AnyObject {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * Checks if a value is an array.
 * @param {any} item - The value to check.
 * @returns {boolean} - Returns true if the value is an array, false otherwise.
 */
function isArray(item: any): item is [] {
  return Array.isArray(item);
}

/**
 * The AnyObject type represents an object with string keys and any type of values.
 * @typedef {object} AnyObject
 */
type AnyObject = { [key: string | number]: any };

/**
 * The MergeOptions interface provides options for configuring custom merge strategies.
 * @typedef {Object} MergeOptions
 * @property {(key: string, targetVal: any, sourceVal: any) => any} [customMerge] - Optional custom merge strategy function.
 */
interface MergeOptions {
  customMerge?: (key: string, targetVal: any, sourceVal: any) => any;
}

/**
 * Merges two objects deeply, combining their properties recursively.
 * @function
 * @param {AnyObject} target - The target object to merge properties into.
 * @param {AnyObject} source - The source object to merge properties from.
 * @param {MergeOptions} [options] - Optional configuration for custom merge strategies.
 * @param {Map<AnyObject, AnyObject>} [seen] - A Map for tracking circular references (optional).
 * @returns {AnyObject} - The merged object.
 */
function deepMerge<T extends AnyObject, S extends AnyObject>(
  target: T | null,
  source: S,
  options: MergeOptions = {},
  seen: Map<AnyObject, AnyObject> = new Map(),
): T & S {
  if (seen.has(source)) {
    return seen.get(source) as T & S;
  }

  if (!isObject(target) || !isObject(source)) {
    if (isArray(target) && isArray(source)) {
      return [...target, ...source] as unknown as T & S;
    }

    return source as unknown as T & S;
  }

  const result: AnyObject = { ...target };

  seen.set(source, result);

  const allKeys = [
    ...Object.keys(source),
    ...Object.getOwnPropertySymbols(source),
  ];

  allKeys.forEach((key) => {
    const sourceVal = source[key as keyof S];
    const targetVal = target[key as keyof T];

    if (options.customMerge) {
      const customResult = options.customMerge(
        key as string,
        targetVal,
        sourceVal,
      );
      if (customResult !== undefined) {
        result[key as string] = customResult;
        return;
      }
    }

    if ((sourceVal as unknown) instanceof Date) {
      result[key as string] = new Date(sourceVal.getTime());
      return;
    }

    if ((sourceVal as unknown) instanceof RegExp) {
      result[key as string] = new RegExp(sourceVal.source, sourceVal.flags);
      return;
    }

    if ((sourceVal as unknown) instanceof Map) {
      const resultMap = new Map(
        (targetVal as unknown) instanceof Map ? targetVal : [],
      );
      sourceVal.forEach((value: unknown, key: unknown) => {
        resultMap.set(key, value);
      });

      result[key as string] = resultMap;
      return;
    }

    if ((sourceVal as unknown) instanceof Set) {
      const resultSet: Set<unknown> = new Set(
        (targetVal as unknown) instanceof Set ? targetVal : [],
      );
      sourceVal.forEach((value: unknown) => {
        resultSet.add(value);
      });
      result[key as string] = resultSet;
      return;
    }

    if (isArray(sourceVal) && isArray(targetVal)) {
      result[key as string] = [...targetVal, ...sourceVal];
    } else if (isObject(sourceVal)) {
      result[key as string] = deepMerge(
        isObject(targetVal) ? targetVal : {},
        sourceVal,
        options,
        seen,
      );
    } else {
      result[key as string] = sourceVal;
    }
  });

  return result as unknown as T & S;
}

export default deepMerge;
