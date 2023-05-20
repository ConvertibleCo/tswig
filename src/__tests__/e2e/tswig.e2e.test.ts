import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import crypto from 'crypto';
import glob from 'glob';

// Helper function to execute a shell command
function execShellCommand(cmd: string): Promise<string> {
  return new Promise<string>((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

// Helper function to generate a hash for a directory content
function hashDirectoryContent(directoryPath: string): string {
  const hash = crypto.createHash('sha256');

  // Get all files in the directory
  const files = glob.sync(path.join(directoryPath, '**', '*'));

  // Sort the files to ensure consistent hashing
  files.sort();

  // Hash each file's content
  files.forEach((file) => {
    const content = fs.readFileSync(file);
    hash.update(content);
  });

  return hash.digest('hex');
}

// Helper function to get TypeScript version from environment variable
function getTypeScriptVersion(): string {
  return process.env["TSWIG_E2E_TS_VERSION"] || '5.0.4';
}

// Helper function to rewrite tsconfig with "extends" as an array for TypeScript 5+
function rewriteTsconfig(projectPath: string): void {
  const tsconfigPath = path.join(projectPath, 'tsconfig.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

  if (tsconfig.compilerOptions?.target?.startsWith('5')) {
    tsconfig.extends = Array.isArray(tsconfig.extends) ? tsconfig.extends : [tsconfig.extends];
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  }
}

describe('End-to-End Tests for tswig', () => {
  // Paths to mock projects
  const mockProjectsPath = path.join(__dirname, 'mockProjects');
  const mockProjects = fs.readdirSync(mockProjectsPath);

  // Read TypeScript version from environment variable
  const tsVersion = getTypeScriptVersion();

  // Run a test for each mock project
  mockProjects.forEach((mockProject) => {
    const projectPath = path.join(mockProjectsPath, mockProject);

    beforeAll(async () => {
      // Rewrite tsconfig with "extends" as an array for TypeScript 5+
      rewriteTsconfig(projectPath);
    });

    it(`should correctly convert TypeScript to JavaScript in ${mockProject}`, async () => {
      // Install the package and run the build command in the mock project
      const installCmd = `cd ${projectPath} && npm install && npm i typescript@${tsVersion} --save-dev && npm run build`;
      await execShellCommand(installCmd);

      // Hash the content of the output directory
      const outputDirectoryPath = path.join(projectPath, 'dist');
      const outputHash = hashDirectoryContent(outputDirectoryPath);

      // Hash the content of the expected output directory
      const expectedOutputDirectoryPath = path.join(projectPath, 'expected');
      const expectedOutputHash = hashDirectoryContent(expectedOutputDirectoryPath);

      // Assert that the output hash matches the expected output hash
      expect(outputHash).toEqual(expectedOutputHash);
    });
  });
});
