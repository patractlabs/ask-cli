#!/usr/bin/env node

const https = require('https');
const {execute} = require('./utils/executor');
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');

const DepensUrl = "https://raw.githubusercontent.com/patractlabs/ask-cli/main/depens.json";

program
  .option('--latest', 'to use latest version');

  program.parse(process.argv);

const options = program.opts();
const useDefault = options.latest === undefined;

function install_depens(depens) {
  const keys = Object.keys(depens);
  let args = ['install'];
  for (let key of keys) {
    let dep = `${key}@${depens[key]}`;
    args.push(dep);
  }

  if (args.length > 1) {
    execute('npm', args);
  }
}

function create_folders() {
  const contractsDir = path.join(process.cwd(), 'contracts');
  if (fs.existsSync(contractsDir)) {
    fs.emptyDirSync(contractsDir);
    fs.rmdirSync(contractsDir);
  }
  fs.mkdirSync(contractsDir);
}

console.log("start to install dependencies for ask! ");

if (useDefault) {
  let DefaultDeps = {
    "ask-lang": "0.1.0",
    "ask-transform": "0.0.16"
  };

  install_depens(DefaultDeps);
  create_folders();
} else {
  https.get(DepensUrl, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // complete response has been received.
    resp.on('end', () => {
      install_depens(JSON.parse(data));
      create_folders();
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
