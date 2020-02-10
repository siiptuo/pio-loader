// SPDX-FileCopyrightText: 2020 Tuomas Siipola
// SPDX-License-Identifier: ISC

const { execFile } = require("child_process");
const { extname } = require("path");

module.exports = function(source) {
  const callback = this.async();
  const ext = extname(this.resourcePath).slice(1);
  const process = execFile(
    "pio",
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
