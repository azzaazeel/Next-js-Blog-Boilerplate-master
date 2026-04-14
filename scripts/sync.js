const { execSync } = require('child_process');

function run() {
  try {
    console.log('🚀 Starting sync to GitHub...');
    
    console.log('📦 Adding changes...');
    execSync('git add .', { stdio: 'inherit' });
    
    console.log('✍️ Committing...');
    try {
      execSync('git commit -m "." --no-verify', { stdio: 'inherit' });
    } catch (e) {
      console.log('ℹ️ Nothing to commit, proceeding to push...');
    }
    
    console.log('📤 Pushing to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Sync completed successfully!');
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

run();
