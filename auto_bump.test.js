"use strict";
const { AutoBump, checkConfig, defaultOptions } = require("./auto_bump");
const { FsUtil } = require("./fs_util");

test("checkConfig should return error when config is not valid", () => {
  const tests = [
    {
      config: {},
      isValid: false
    },
    {
      config: { autoBump: {} },
      isValid: true
    }
  ];

  tests.forEach(testCase => {
    expect(checkConfig(testCase.config) == null).toBe(testCase.isValid);
  });
});

test("updateVersion should format config and write it back to package.json", () => {
  const mockPath = "repoPath";
  const mockConfig = {};
  const mockWriteFileSync = (content, config) => {
    expect(content).toBe(`${mockPath}/package.json`);
    expect(config).toEqual(JSON.stringify(mockConfig, null, 2));
  };

  const fsUtil = new FsUtil(mockWriteFileSync);
  fsUtil.updateVersion(mockPath, {});
});

describe("AutoBump", () => {
  const mockExec = cmd => cmd;
  const mockPath = "repoPath";
  const mockVersion = "0.0.1";
  const mockPrevRelease = "1.0.0";
  const mockCommitWalk = () => {
    return [];
  };
  const mockConfig = {
    autoBump: {}
  };

  class MockGitUtil {
    constructor() {
      this.getLastVersion = () => mockPrevRelease;
      this.commit = () => {};
    }
  }

  class MockFsUtil {
    constructor() {
      this.updateVersion = () => true;
    }
  }

  test("makeOptions should return defaultOptions overriden by user specified options", () => {
    const tests = [
      {
        userOptions: {
          number: 1,
          execOptions: "user specified"
        },
        options: {
          repo: mockPath,
          fields: defaultOptions.fields,
          branch: `${mockPrevRelease}..HEAD`,
          number: 1,
          execOptions: "user specified"
        }
      },
      {
        userOptions: {
          number: 1
        },
        options: {
          repo: mockPath,
          fields: defaultOptions.fields,
          branch: `${mockPrevRelease}..HEAD`,
          number: 1,
          execOptions: defaultOptions.execOptions
        }
      },
      {
        userOptions: {
          execOptions: "user specified"
        },
        options: {
          repo: mockPath,
          fields: defaultOptions.fields,
          branch: `${mockPrevRelease}..HEAD`,
          number: defaultOptions.number,
          execOptions: "user specified"
        }
      }
    ];

    tests.forEach(testCase => {
      const bumper = new AutoBump(
        mockPath,
        { autoBump: { ...testCase.userOptions } },
        mockCommitWalk,
        new MockGitUtil()
      );

      expect(bumper.makeOptions(mockPath, mockPrevRelease)).toEqual(
        testCase.options
      );
    });
  });

  test("getSrcVersion should get valid previous Version tag or Initial Commit SHA Id", () => {
    const tests = [
      {
        initCommitId: null,
        prevVersion: "0.0.1",
        output: {
          prevVersion: "0.0.1",
          initCommitId: null
        }
      },
      {
        initCommitId: "hashid",
        prevVersion: null,
        output: {
          prevVersion: null,
          initCommitId: "hashid"
        }
      }
    ];

    tests.forEach(testCase => {
      class MockGitUtil {
        constructor() {
          this.getLastVersion = () => testCase.prevVersion;
          this.getInitialCommitId = () => testCase.initCommitId;
          this.commit = () => {};
        }
      }

      const bumper = new AutoBump(
        mockPath,
        { autoBump: {} },
        mockCommitWalk,
        new MockGitUtil()
      );
      expect(bumper.getSrcVersion()).toEqual(testCase.output);
    });
  });

  test("parseCommits will loop all commits and bump version", () => {
    const tests = [
      {
        commits: [
          { subject: "fix" },
          { subject: "feat" },
          { subject: "BREAKING CHANGE" }
        ],
        version: "1.1.1"
      },
      {
        commits: [
          { subject: "" },
          { subject: "feat" },
          { subject: "BREAKING CHANGE" }
        ],
        version: "1.1.0"
      },
      {
        commits: [
          { subject: "feat" },
          { subject: "feat" },
          { subject: "BREAKING CHANGE" }
        ],
        version: "1.2.0"
      },
      {
        commits: [
          { subject: "no" },
          { subject: "fix" },
          { subject: "feat" },
          { subject: "BREAKING CHANGE" }
        ],
        version: "1.1.1"
      }
    ];

    tests.forEach(testCase => {
      const mockCommitWalk = () => {
        return testCase.commits;
      };
      const bumper = new AutoBump(
        mockPath,
        { autoBump: {} },
        mockCommitWalk,
        new MockGitUtil()
      );
      expect(
        bumper.parseCommits(bumper.makeOptions(mockPath), "0.0.0")
      ).toEqual(testCase.version);
    });
  });

  test("bump should call updateConfig", () => {
    const bumper = new AutoBump(
      mockPath,
      { autoBump: {} },
      mockCommitWalk,
      new MockGitUtil()
    );

    bumper.updateConfig = jest.fn();
    bumper.bump();

    expect(bumper.updateConfig.mock.calls.length > 0).toBe(true);
  });
});
