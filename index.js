// SPDX-FileCopyrightText: 2020 Tuomas Siipola
// SPDX-License-Identifier: ISC

const { execFile } = require("child_process");
const path = require("path");

const bin = path.resolve(__dirname, "pio");

module.exports = function(source) {
  const callback = this.async();
  const ext = path.extname(this.resourcePath).slice(1);
  const process = execFile(
    bin,
    ["--output-format", ext, "--input-format", ext],
    { encoding: "buffer" },
    (error, stdout, stderr) => {
      if (error) {
        callback(error, source);
      } else {
        callback(null, stdout);
      }
    }
  );
  process.stdin.end(source);
};

module.exports.raw = true;
