import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import * as crypto from 'crypto';
import { globSync } from 'glob';

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
  const files = globSync(path.join(directoryPath, '**', '*'));

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
  return process.env["TSWIG_TS_VERSION"] || '5.0.4';
}

describe('End-to-End Tests for tswig', () => {
  // Paths to mock projects
  const root = path.join(__dirname, '../../../');
  const mockProjectsPath = path.join(root, 'examples');
  const mockProjects = fs.readdirSync(mockProjectsPath);

  // Read TypeScript version from environment variable
  const tsVersion = getTypeScriptVersion();

  // Filter to run only the projects that match the TypeScript version
  const targetProjects = mockProjects.filter((p) => p.includes("ts") ? p === `ts-${tsVersion[0]}` : true)
  // Run a test for each mock project
  targetProjects.forEach((mockProject) => {
    const projectPath = path.join(mockProjectsPath, mockProject);

    afterEach(async () => {
      // make sure we remove typescript from the mock projects
      // in non CI envs.
      if(process.env["GITHUB_ACTIONS"] !== "true") {
        // uninstall typescript
        const uninstallCmd = `cd ${projectPath} && npm uninstall typescript`;
        await execShellCommand(uninstallCmd);
      }
    })

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
