const child_process = require("child_process");
const alfy = require("alfy");

const activeDeveloperDir = child_process
  .execFileSync("xcode-select", ["-p"], { encoding: "utf8" })
  .trim();

child_process.execFileSync("open", [
  `${activeDeveloperDir}/Applications/Simulator.app`,
  "--args",
  "-CurrentDeviceUDID",
  alfy.input,
]);

try {
  child_process.spawnSync("xcrun", ["instruments", "-w", alfy.input]);
} catch {}
