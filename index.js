// SPDX-FileCopyrightText: 2020 Tuomas Siipola
// SPDX-License-Identifier: ISC

const { execFile } = require("child_process");
const path = require("path");

const bin = path.resolve(__dirname, "pio");

module.exports = function (source) {
  const callback = this.async();
  const ext = path.extname(this.resourcePath).slice(1).toLowerCase();
  const process = execFile(
    bin,
    ["--output-format", ext === "jpg" ? "jpeg" : ext],
    { encoding: "buffer", maxBuffer: 10 * 1024 * 1024 },
    (error, stdout, stderr) => {
      if (error) {
        callback(error, source);
      } else {
        callback(null, stdout);
      }
    }
  );
  // Write can fail if the process exists immediately. Ignore error here
  // because this case is handled in `execFile` callback.
  process.stdin.on("error", (error) => {});
  process.stdin.end(source);
};

module.exports.raw = true;
