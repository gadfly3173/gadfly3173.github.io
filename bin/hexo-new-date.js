const shell = require('shelljs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, '0');

readline.question('请输入文章标题\n', name => {
  shell.exec(`npx hexo new post --path "${year}/${month}/${name}"`);
  readline.close()
  process.exit();
})

