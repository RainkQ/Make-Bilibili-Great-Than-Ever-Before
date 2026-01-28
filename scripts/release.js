const { execSync } = require('node:child_process');
const { version } = require('../package.json');

const tagName = `v${version}`;
const command = `gh release create ${tagName} dist/*.js --repo RainkQ/Make-Bilibili-Great-Than-Ever-Before --generate-notes`;

try {
  console.log(`Executing: ${command}`);
  execSync(command, { stdio: 'inherit' });
  console.log(`Successfully created GitHub release for tag ${tagName}`);
} catch {
  console.error(`Failed to create GitHub release for tag ${tagName}.`);
  // The error from execSync will be printed to stderr because of 'inherit'
  process.exit(1);
}
