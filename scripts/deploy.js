const { execSync } = require('child_process');

function run() {
  try {
    console.log('🚀 Starting VPS Deployment...');
    
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
    // We use npm run redeploy which is already defined as 'npm run build'
    execSync('npm run redeploy', { stdio: 'inherit' });
    
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
