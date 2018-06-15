"use strict";
class FsUtil {
  constructor(writeFileSync) {
    this.writeFileSync = writeFileSync;
    this.updateVersion = this.updateVersion.bind(this);
  }

  updateVersion(repoPath, config) {
    return this.writeFileSync(
      `${repoPath}/package.json`,
      JSON.stringify(config, null, 2)
    );
  }
}

module.exports = {
  FsUtil
};
