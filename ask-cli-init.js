#!/usr/bin/env node

const https = require('https');
const {execute} = require('./utils/executor');

const DepensUrl = "https://raw.githubusercontent.com/patractlabs/ask-cli/main/depens.json";

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

console.log("start to install dependencies: ");
https.get(DepensUrl, (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // complete response has been received.
  resp.on('end', () => {
    install_depens(JSON.parse(data));
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
