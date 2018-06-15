#!/usr/bin/env node
"use strict";
const { execSync } = require("child_process");
const gitlog = require("gitlog");
const { resolve } = require("path");
const fs = require("fs");
const { AutoBump } = require("./auto_bump");
const { FsUtil } = require("./fs_util");
const { GitUtil } = require("./git_util");
const { printError } = require("./print_util");

function main() {
  const repoPath = resolve("./");
  try {
    const config = JSON.parse(fs.readFileSync(`${repoPath}/package.json`));
    const gitUtil = new GitUtil(execSync);
    const fsUtil = new FsUtil(fs.writeFileSync);
    const bumper = new AutoBump(repoPath, config, gitlog, gitUtil, fsUtil);

    bumper.bump();
  } catch (err) {
    printError(err);
    return;
  }
}

main();
