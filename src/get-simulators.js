const alfy = require("alfy");
const util = require("util");
const child_process = require("child_process");

const CACHE_KEY = "sims";

exec = util.promisify(child_process.exec);

const getSimulators = exec("xcrun simctl list --json devices available")
  .then((out) => out.stdout)
  .then((sims) => {
    alfy.cache.set(CACHE_KEY, sims);
    return sims;
  });

const cachedSimulators = alfy.cache.get(CACHE_KEY);

(cachedSimulators ? Promise.resolve(cachedSimulators) : getSimulators)
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
