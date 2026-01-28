'use strict';

const { execSync } = require('child_process');
const { version } = require('../package.json');

const tagName = `v${version}`;
const repo = 'RainkQ/Make-Bilibili-Great-Than-Ever-Before';
const pkgManager = 'pnpm'; // Assuming pnpm, as per project setup

/**
 * Executes a command and prints its output.
 * The script will exit if the command fails.
 * @param {string} command The command to execute.
 */
function runOrFail(command) {
  try {
    console.log(`\n[EXEC] ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n[FAIL] Command failed: ${command}`);
    process.exit(1);
  }
}

/**
 * Executes a command that might fail, and warns instead of exiting.
 * @param {string} command The command to execute.
 */
function runAndWarn(command) {
  try {
    console.log(`\n[EXEC] ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.warn(`\n[WARN] Command "${command}" failed. This might be okay. Continuing...`);
  }
}

console.log(`
======================================================
  Starting re-release process for version: ${tagName}
======================================================
`);

// --- Step 1: Force-update local tag ---
console.log('--- Step 1: Force-updating local tag ---');
runOrFail(`git tag -f ${tagName}`);

// --- Step 2: Delete existing GitHub release and remote tag ---
console.log('\n--- Step 2: Deleting GitHub release and remote tag ---');
runAndWarn(`gh release delete ${tagName} --repo ${repo} --yes`);
runAndWarn(`git push origin :${tagName}`); // Also delete remote tag just in case release deletion doesn't

// --- Step 3: Force-push the updated tag ---
console.log('\n--- Step 3: Force-pushing updated tag ---');
runOrFail(`git push origin ${tagName} --force`);

// --- Step 4: Re-build the project ---
console.log('\n--- Step 4: Re-building project ---');
runOrFail(`${pkgManager} run build`);

// --- Step 5: Re-create the GitHub release ---
console.log('\n--- Step 5: Re-creating GitHub release ---');
runOrFail(`gh release create ${tagName} dist/*.js --repo ${repo} --generate-notes`);

console.log(`
======================================================
  Successfully re-released version ${tagName}!
======================================================
`);
