const { spawnSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const categoryArg = args.find(a => a.startsWith('--category='));
const category = categoryArg ? categoryArg.split('=')[1] : null;

console.log('--- Starting Redeploy Process ---');

// Check if running on VPS (Linux + path check or explicit env var)
const isVPS = process.env.IS_VPS === 'true' || (process.platform === 'linux' && process.cwd().includes('kanocs.com'));

// 1. Generate Performance Data
if (isVPS) {
  console.log('Step 1: [SKIPPED] Performance generation is skipped on VPS.');
} else {
  console.log('Step 1: Generating performance data...');
  const genArgs = ['scripts/generate-performance-json.js'];
if (category) {
  genArgs.push(`--category=${category}`);
}

  const genResult = spawnSync('node', genArgs, { stdio: 'inherit', shell: true });
  if (genResult.status !== 0) {
    console.error('Performance generation failed.');
    process.exit(1);
  }
}

// 2. Build Next.js
console.log('\nStep 2: Building Next.js project...');
const buildResult = spawnSync('npm', ['run', 'build-next'], { stdio: 'inherit', shell: true });
if (buildResult.status !== 0) {
  console.error('Next.js build failed.');
  process.exit(1);
}

console.log('\n--- Redeploy Completed Successfully ---');
