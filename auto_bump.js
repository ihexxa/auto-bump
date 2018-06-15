"use strict";
const { writeFileSync } = require("fs");
const program = require("commander");
const semver = require("semver");
const { printBumps, printError } = require("./print_util");

const defaultOptions = {
  number: 100000,
  fields: ["hash", "subject", "parentHashes"],
  execOptions: {
    maxBuffer: 10 * 1024 * 1024
  },
  majorPattern: "^BREAKING CHANGE",
  minorPattern: "^feat",
  patchPattern: "^fix"
};

function parseConfig(config) {
  if (config == null) {
    throw new Error(`${repoPath}/package.json is not found`);
  }
  if (config.autoBump == null) {
    return { ...config, autoBump: {} };
  }

  return config;
}

class AutoBump {
  constructor(repoPath, config, walk, gitUtil, fsUtil) {
    this.config = parseConfig(config);

    this.walk = walk;
    this.gitUtil = gitUtil;
    this.fsUtil = fsUtil;
    this.repoPath = repoPath;
    this.regMajor = this.config.autoBump.majorPattern
      ? new RegExp(this.config.autoBump.majorPattern, "gi")
      : new RegExp(defaultOptions.majorPattern, "gi");
    this.regMinor = this.config.autoBump.minorPattern
      ? new RegExp(this.config.autoBump.minorPattern, "gi")
      : new RegExp(defaultOptions.minorPattern, "gi");
    this.regPatch = this.config.autoBump.patchPattern
      ? new RegExp(this.config.autoBump.patchPattern, "gi")
      : new RegExp(defaultOptions.patchPattern, "gi");

    this.bump = this.bump.bind(this);
    this.makeOptions = this.makeOptions.bind(this);
    this.parseCommits = this.parseCommits.bind(this);
    this.getSrcVersion = this.getSrcVersion.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
  }

  bump() {
    const { prevVersion, initCommitId } = this.getSrcVersion();

    const options = this.makeOptions(
      this.repoPath,
      prevVersion != null ? prevVersion : initCommitId
    );
    const nextVersion = this.parseCommits(
      options,
      prevVersion != null ? prevVersion : "0.0.1"
    );

    if (nextVersion === this.config.version) {
      printError("No new commit is found, version is not bumped.");
      return;
    }
    this.updateConfig(nextVersion);
  }

  getSrcVersion() {
    let initCommitId = null;
    const prevVersion = this.gitUtil.getLastVersion(this.repoPath);
    if (prevVersion == null || !semver.valid(prevVersion)) {
      initCommitId = this.gitUtil.getInitialCommitId(this.repoPath);
      if (initCommitId == null) {
        return;
      }
    }

    return { prevVersion, initCommitId };
  }

  makeOptions(repoPath, prevVersion) {
    const userOptions = this.config.autoBump;

    return {
      repo: repoPath,
      fields: defaultOptions.fields,
      branch: `${prevVersion}..HEAD`,
      number: userOptions.number ? userOptions.number : defaultOptions.number,
      execOptions: userOptions.execOptions
        ? userOptions.execOptions
        : defaultOptions.execOptions
    };
  }

  updateConfig(nextVersion) {
    try {
      const config = { ...this.config, version: nextVersion };
      this.fsUtil.updateVersion(this.repoPath, config);
      this.gitUtil.commit(this.repoPath, nextVersion);
    } catch (err) {
      printError(`Fail to update package.json or git commit: ${err}`);
    }
  }

  parseCommits(options, previousVersion) {
    let commits = this.walk(options);
    let nextVersion = previousVersion;

    const history = commits
      .slice(0)
      .reverse()
      .map(commit => {
        const originVersion = nextVersion;
        let bumpStep = "no";

        if (commit.subject.match(this.regMajor)) {
          nextVersion = semver.inc(nextVersion, "major");
          bumpStep = "major";
        } else if (commit.subject.match(this.regMinor)) {
          nextVersion = semver.inc(nextVersion, "minor");
          bumpStep = "minor";
        } else if (commit.subject.match(this.regPatch)) {
          nextVersion = semver.inc(nextVersion, "patch");
          bumpStep = "patch";
        } else {
          // skip this version
        }

        return {
          originVersion,
          nextVersion,
          subject: commit.subject,
          bumpStep
        };
      });

    printBumps(history);
    return nextVersion;
  }
}

module.exports = {
  AutoBump,
  parseConfig,
  defaultOptions
};
