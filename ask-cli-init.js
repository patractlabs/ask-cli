#!/usr/bin/env node

const fetch = require('node-fetch');
const {execute} = require('./utils/executor');

const DepensUrl = "https://github.com/patractlabs/ask-cli/blob/main/depens.json";

function install_depens(depens) {
  console.log(depens);
  const keys = Object.keys(depens);
  let args = ['install'];
  for (let key in keys) {
    let dep = `${key}@${depens[key]}`;
    args.push(dep);
  }

  execute('npm', args);
}

fetch(DepensUrl)
    .then(res => res.json())
    .then(depens => install_depens(depens))
    .catch(e => console.log(e));


