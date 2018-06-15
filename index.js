#!/usr/bin/env node
"use strict";
const { execSync } = require("child_process");
const gitlog = require("gitlog");
const { resolve } = require("path");
const { writeFileSync } = require("fs");
const { AutoBump } = require("./auto_bump");
const { FsUtil } = require("./fs_util");
const { GitUtil } = require("./git_util");

function main() {
  const repoPath = resolve("./");
  const config = require(`${repoPath}/package.json`);
  const gitUtil = new GitUtil(execSync);
  const fsUtil = new FsUtil(writeFileSync);
  const bumper = new AutoBump(repoPath, config, gitlog, gitUtil, fsUtil);

  bumper.bump();
}

main();
