const alfy = require("alfy");
const util = require("util");
const child_process = require("child_process");

const CACHE_KEY = "avds";

exec = util.promisify(child_process.exec);

const getEmulators = exec("emulator -list-avds")
  .then((out) => out.stdout)
  .then((avds) => {
    alfy.cache.set(CACHE_KEY, avds);
    return avds;
  });

const cachedEmulators = alfy.cache.get(CACHE_KEY);

(cachedEmulators ? Promise.resolve(cachedEmulators) : getEmulators)
  .then((avds) =>
    avds
      .split("\n")
      .filter((avd) => !!avd)
      .map((avd) => ({
        title: avd.split("_").slice(0, -2).join(" "),
        subtitle: avd.split("_").slice(-2).join(" "),
        arg: avd,
      }))
  )
  .then((items) => alfy.output(items));
