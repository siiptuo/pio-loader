// SPDX-FileCopyrightText: 2020 Tuomas Siipola
// SPDX-License-Identifier: ISC

const fs = require("fs");
const https = require("https");
const path = require("path");
const { execFileSync } = require("child_process");

function _request(url, resolve, reject) {
  https
    .get(url, res => {
      if (res.statusCode === 200) {
        resolve(res);
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        _request(res.headers.location, resolve, reject);
      } else {
        reject(new Error("invalid status: " + res.statusCode));
      }
    })
    .on("error", err => {
      reject(err);
    });
}

const request = url => new Promise(_request.bind(null, url));

const version = "0.2.0";
const base = `https://github.com/siiptuo/pio/releases/download/${version}/pio-${version}-`;
const platformUrl = {
  "linux-x64": `${base}x86_64-unknown-linux-musl`
};
const platform = `${process.platform}-${process.arch}`;
const bin = path.resolve(__dirname, "pio");

function testPio() {
  const output = execFileSync(bin, ["--version"], { encoding: "utf-8" }).trim();
  return output === `pio ${version}`;
}

if (!platformUrl[platform]) {
  console.error(
    `prebuild pio binary is not available for your platform: ${platform}`
  );
  process.exit(1);
}

console.log("downloading prebuild pio binary...");
const res = request(platformUrl[platform])
  .then(res => {
    const file = fs.createWriteStream(bin);
    file.on("finish", () => {
      file.close();
      fs.chmodSync(bin, 0o755);
      if (!testPio()) {
        console.error("running pio failed");
        fs.unlinkSync(bin);
        process.exit(1);
      }
    });
    file.on("error", err => {
      console.error("downloading pio failed: " + err);
      fs.unlinkSync(bin);
      process.exit(1);
    });
    res.pipe(file);
  })
  .catch(err => {
    console.error("downloading pio failed: " + err);
    process.exit(1);
  });
