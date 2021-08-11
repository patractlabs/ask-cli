#!/usr/bin/env node

const program = require('commander');
const term = require('terminal-kit').terminal;
const pkg = require('./package.json');

program.version(pkg.version, '-v,--version');

program.addHelpText('after',
`
  Usages:
    $ ask-cli init
    $ ask-cli compile [--debug|--release]
`);

program.showHelpAfterError();
// 配置command
program.command('init', 'To init the project');
program.command('compile', 'To compile the contract');
program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}