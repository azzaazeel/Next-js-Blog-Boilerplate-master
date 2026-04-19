const { execSync } = require('child_process');

function run() {
  try {
    console.log('🚀 Starting VPS Deployment...');
    
    console.log('🔍 Checking for updates from GitHub...');
    execSync('git fetch origin main', { stdio: 'inherit' });
    
    const localCommit = execSync('git rev-parse HEAD').toString().trim();
    const remoteCommit = execSync('git rev-parse origin/main').toString().trim();

    if (localCommit === remoteCommit) {
      console.log('✅ Already up to date. No new changes found on GitHub.');
      console.log('🛑 Stopping deployment.');
      return;
    }

    console.log('🚀 New updates found! Proceeding with deployment...');

    console.log('🧹 Cleaning up local changes on VPS...');
    try {
      execSync('git checkout next-env.d.ts package-lock.json', { stdio: 'inherit' });
    } catch (e) {
      console.log('⚠️ Cleanup failed or files were already clean.');
    }

    console.log('📥 Pulling latest code from GitHub...');
    execSync('git pull origin main', { stdio: 'inherit' });
    
    console.log('📦 Installing dependencies...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

    console.log('🏗️ Rebuilding project (this may take a minute)...');
    // We skip 'npm run redeploy' on server as it's for local only
    execSync('npm run build-next', { stdio: 'inherit', env: { ...process.env, IS_VPS: 'true' } });
    
    console.log('🔄 Restarting PM2 processes...');
    try {
      execSync('pm2 restart all', { stdio: 'inherit' });
    } catch (e) {
      console.log('⚠️ PM2 restart failed. If this is the first time, you might need to run pm2 start manually.');
    }
    
    console.log('✨ VPS Deployment completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

run();
