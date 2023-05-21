/**
 * Converts a glob pattern to a regular expression.
 * @param {string} globPattern - The glob pattern to convert.
 * @returns {RegExp} The regular expression equivalent of the glob pattern.
 */
function globToRegex(globPattern: string): RegExp {
  const specialCharsRegex = /[|\\{}()[\]^$+*?.]/g;
  const escapedPattern = globPattern.replace(specialCharsRegex, '\\$&');

  const wildcardRegex = /\\\*/g;
  const regexPattern = escapedPattern.replace(wildcardRegex, '[^/]*');

  const doubleWildcardRegex = /\\\/\\\*\*/g;
  const regexPatternWithDoubleWildcard = regexPattern.replace(doubleWildcardRegex, '(?:\\/[^/]+)*');

  const singleCharWildcardRegex = /\\\?/g;
  const regexPatternWithSingleCharWildcard = regexPatternWithDoubleWildcard.replace(singleCharWildcardRegex, '[^/]');

  const directoryWildcardRegex = /\\\*\*\\\//g;
  const regexPatternWithDirectoryWildcard = regexPatternWithSingleCharWildcard.replace(directoryWildcardRegex, '(?:\\/[^/]+\\/)*(?:\\/[^/]+)?');

  return new RegExp(`^${regexPatternWithDirectoryWildcard}$`, 'i');
}

export default globToRegex;
