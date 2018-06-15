"use strict";
const { printError } = require("./print_util");

function cleanStr(msg) {
  return msg.toString().replace("\n", "");
}

class GitUtil {
  constructor(execSync) {
    this.exec = execSync;
    this.commit = this.commit.bind(this);
    this.getLastVersion = this.getLastVersion.bind(this);
    this.getInitialCommitId = this.getInitialCommitId.bind(this);
  }

  getLastVersion(repoPath) {
    try {
      return cleanStr(this.exec(`git -C ${repoPath} describe --abbrev=0`));
    } catch (err) {
      printError(`No previous version tag found, seeking for initial commit.`);
      // TODO: add verbose mode
      // printError(JSON.stringify(err, null, 2));
    }
    return null;
  }

  getInitialCommitId(repoPath) {
    try {
      return cleanStr(
        this.exec(`git -C ${repoPath} rev-list --max-parents=0 HEAD`)
      );
    } catch (err) {
      printError(`No initial commit found.`);
      // TODO: add verbose mode
      // printError(JSON.stringify(err, null, 2));
    }
    return null;
  }

  commit(repoPath, version) {
    return cleanStr(
      this.exec(
        `git -C ${repoPath} commit package.json -m "auto-bump: bump to ${version}"`
      )
    );
  }
}

module.exports = {
  GitUtil
};
