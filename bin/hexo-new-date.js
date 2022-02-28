const shell = require('shelljs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question('请输入文章标题\n', name => {
  shell.exec(`npx hexo new post "${name}"`);
  readline.close()
  process.exit();
})

