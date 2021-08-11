const spawn = require('cross-spawn');

const execute = (cmd, args) => {
  const rs = spawn.sync(cmd, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env
  });

  if (rs.stderr && rs.stderr.length > 0) {
    let isWarning = false;
    if (rs.stderr.indexOf('WARNING') !== -1) isWarning = true;

    if (!isWarning) return console.log(chalk.red(`Error: ${rs.stderr}`));

    console.log(chalk.yellow(`Warning: ${rs.stderr}`));
  }

  if (rs.error) {
    console.log(chalk.red(`Error: ${rs.stderr}`));
    return false;
  }

  console.log(rs.stdout);
}

module.exports = { execute }