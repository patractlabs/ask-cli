#!/usr/bin/env node

const program = require('commander');
// const glob = require('glob');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const {execute} = require('./utils/executor');

program
  .argument('<contract>', "Contract file to be compiled.")
  .option('--debug', 'Compiled to debug code')
  .option('--release', 'Compiled to release code, default');

program.parse(process.argv);

const options = program.opts();
const contract = path.join(process.cwd(), program.args[0]);
const releaseMode = options.debug === undefined;

// console.log("compiled mode: ", releaseMode);
// console.log('contract: ', contract);
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

// prepare compile arguments
const contractName = path.parse(contract).name;
const cmdArgs = [
  contract,
  releaseMode,
  buildDir,
  contractName
];

execute('ask', cmdArgs);
