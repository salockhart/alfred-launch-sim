const alfy = require("alfy");
const util = require("util");
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");

exec = util.promisify(child_process.exec);
writeFile = util.promisify(fs.writeFile);
readFile = util.promisify(fs.readFile);

const cachePath = path.join(__dirname, "../cache/sims.json");

const getSimulators = () =>
  exec("xcrun simctl list --json devices available")
    .then((out) => out.stdout)
    .then(async (sims) => {
      // await writeFile(cachePath, sims);
      // const buffer = await readFile(cachePath);
      // const str = buffer.toString();
      // console.log(str);
      // return JSON.parse(str);
      return sims;
    });

getSimulators()
  .then(JSON.parse)
  .then((details) => details.devices)
  .then((runtimes) =>
    Object.keys(runtimes).map((runtime) => {
      const matches = /com.apple.CoreSimulator.SimRuntime.iOS-(.*)/.exec(
        runtime
      );

      if (!matches) return null;

      const version = matches[1].replace("-", ".");
      return runtimes[runtime].map((device) => ({
        title: device.name,
        subtitle: version,
        arg: device.udid,
      }));
    })
  )
  .then((deviceses) => deviceses.filter((devices) => !!devices))
  .then((devices) => devices.flat())
  .then((items) => alfy.output(items));

/**
const alfy = require("alfy");
const util = require("util");
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");

exec = util.promisify(child_process.exec);
writeFile = util.promisify(fs.writeFile);
readFile = util.promisify(fs.readFile);

const cachePath = path.join(__dirname, "../cache/sims.json");

const getSimulators = () =>
  exec("xcrun simctl list --json devices available")
    .then((out) => out.stdout)
    .then(async (sims) => {
      // await writeFile(cachePath, sims);
      return sims;
    });

Promise.race([
  // readFile(cachePath).then((buffer) => buffer.toString()),
  getSimulators(),
])
  .then(console.log)
  .then(JSON.parse)
  .then((details) => details.devices)
  .then((runtimes) =>
    Object.keys(runtimes).map((runtime) => {
      const matches = /com.apple.CoreSimulator.SimRuntime.iOS-(.*)/.exec(
        runtime
      );

      if (!matches) return null;

      const version = matches[1].replace("-", ".");
      return runtimes[runtime].map((device) => ({
        title: device.name,
        subtitle: version,
        arg: device.udid,
      }));
    })
  )
  .then((deviceses) => deviceses.filter((devices) => !!devices))
  .then((devices) => devices.flat())
  .then((items) => alfy.output(items));

   */
