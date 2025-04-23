const { execSync } = require('child_process');
const { log, error } = console;

try {
  execSync('git add .\\source\\_posts\\', { stdio: 'inherit' });
  log('✅ Git add 成功');

  const commitMessage = '更新笔记';
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  log('✅ Git commit 成功');

  execSync('git push', { stdio: 'inherit' });
  log('✅ Git push 成功');

} catch (err) {
  error('❌ 错误:', err.message);
  process.exit(1);
}
