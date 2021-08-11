#!/usr/bin/env node

const program = require('commander');
// const glob = require('glob');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');

program
  .argument('<contract>', "Which contract file to be compiled.")
  .option('--debug', 'Compiled to debug code')
  .option('--release', 'Compiled to release code, default');

program.parse(process.argv);

const options = program.opts();
const contract = path.join(process.cwd(), program.args[0]);
const releaseMode = options.debug === undefined;

console.log("compiled mode: ", releaseMode);
console.log('contract: ', contract);
// to check if `contract` existed or not
if (!fs.existsSync(contract)) {
  console.log(chalk.red(`Error: '${contract}' is not exist.`));
  process.exit(1);
}
// clean build folder
const buildDir = path.join(process.cwd(), 'build');
if (fs.existsSync(buildDir)) {
  fs.emptyDirSync(buildDir);
  fs.rmdirSync(buildDir);
}
fs.mkdirSync(buildDir);

// process.env.PATH = `${process.env.PATH}${
//   process.platform === 'win32' ? ';' : ':'
// }${process.cwd()}/node_modules/ask-transform/bin/.bin`;

// // for (let i in contracts) {
const contractName = path.parse(contract).name;
const cmdArgs = [
  contract,
  releaseMode,
  buildDir,
  contractName
];

const rs = spawn.sync('ask', cmdArgs, {
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
// }

console.log('Build assembly target successfully');