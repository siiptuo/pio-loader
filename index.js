// SPDX-FileCopyrightText: 2020 Tuomas Siipola
// SPDX-License-Identifier: ISC

const { execFile } = require("child_process");
const { getOptions, parseQuery } = require("loader-utils");
const path = require("path");

const bin = path.resolve(__dirname, "pio");

module.exports = function (source) {
  let options = getOptions(this);
  if (this.resourceQuery) {
    options = { ...options, ...parseQuery(this.resourceQuery) };
  }
  const callback = this.async();
  let ext = path.extname(this.resourcePath).slice(1).toLowerCase();
  if (options.format) {
    // Modify the resource path so that output file has correct file extension.
    this.resourcePath =
      this.resourcePath.slice(0, -ext.length) + options.format;
    ext = options.format;
  }
  let args = ["--output-format", ext === "jpg" ? "jpeg" : ext];
  if (options.quality) {
    args = [...args, "--quality", options.quality];
  }
  const process = execFile(
    bin,
    args,
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
