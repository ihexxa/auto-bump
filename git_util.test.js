"use strict";
const { GitUtil } = require("./git_util");

describe("GitUtil", () => {
  const mockExec = cmd => cmd;
  const mockPath = "repoPath";
  const mockVersion = "0.0.1";

  test("getLastVersion should issue command 'git -C <repoPath> decribe...'", () => {
    const gitUtil = new GitUtil(mockExec);
    expect(gitUtil.getLastVersion(mockPath)).toBe(
      `git -C ${mockPath} describe --abbrev=0`
    );
  });

  test("getInitialCommitId should issue command 'git -C <repoPath> rev-list...'", () => {
    const gitUtil = new GitUtil(mockExec);
    expect(gitUtil.getInitialCommitId(mockPath)).toBe(
      `git -C ${mockPath} rev-list --max-parents=0 HEAD`
    );
  });

  test("commit should issue command 'git -C <repoPath> commit'", () => {
    const gitUtil = new GitUtil(mockExec);
    expect(gitUtil.commit(mockPath, mockVersion)).toBe(
      `git -C ${mockPath} commit package.json -m "auto-bump: bump to ${mockVersion}"`
    );
  });
});
