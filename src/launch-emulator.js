const execa = require("execa");
const alfy = require("alfy");

const emulatorCommand = process.env.ANDROID_HOME
  ? `${process.env.ANDROID_HOME}/emulator/emulator`
  : "emulator";

const cp = execa(emulatorCommand, [`@${alfy.input}`], {
  detached: true,
  stdio: "ignore",
});
cp.unref();
