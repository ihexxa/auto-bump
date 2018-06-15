"use strict";
const clc = require("cli-color");

function printBumps(history) {
  if (history == null || history.length == 0) {
    printError("No need to bump.");
    return;
  }

  let table = history.map(row => {
    let version = null;
    switch (row.bumpStep) {
      case "major":
        version = clc.bgBlue(clc.white.bold(` ${row.originVersion} `));
        break;
      case "minor":
        version = clc.bgGreen(clc.white.bold(` ${row.originVersion} `));
        break;
      case "patch":
        version = clc.bgBlack(clc.white.bold(` ${row.originVersion} `));
        break;
      default:
        version = clc.white.black.bold(` ${row.originVersion} `);
    }

    return [
      // clc.xterm(15).bold(` ${row.originVersion} `),
      version,
      clc.xterm(15).bold(row.subject)
    ];
  });

  table = [[clc.bold("Version"), clc.bold("Subject")], ...table];

  console.log(
    clc.white.bold(`\nLegends: `),
    clc.bgBlue(clc.white.bold(` marjor `)),
    clc.bgGreen(clc.white.bold(` minor `)),
    clc.bgBlack(clc.white.bold(` patch `)),
    "\n"
  );
  console.log(clc.columns(table));
  console.log(
    clc.white.bold("Version is bumped to "),
    clc.bgGreen.bold.white(` ${history[history.length - 1].nextVersion} `),
    "\n"
  );
}

function printError(msg) {
  console.log(clc.red.bold(msg));
}

module.exports = {
  printBumps,
  printError
};
