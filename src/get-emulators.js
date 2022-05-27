const alfy = require("alfy");
const util = require("util");
const child_process = require("child_process");

exec = util.promisify(child_process.exec);

exec("emulator -list-avds")
  .then((out) => out.stdout)
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
