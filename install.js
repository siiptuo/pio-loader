// SPDX-FileCopyrightText: 2020 Tuomas Siipola
// SPDX-License-Identifier: ISC

const fs = require("fs");
const https = require("https");
const path = require("path");
const { execFileSync } = require("child_process");

function _request(url, resolve, reject) {
  https
    .get(url, (res) => {
      if (res.statusCode === 200) {
        resolve(res);
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        _request(res.headers.location, resolve, reject);
      } else {
        reject(new Error("invalid status: " + res.statusCode));
      }
    })
    .on("error", (err) => {
      reject(err);
    });
}

const request = (url) => new Promise(_request.bind(null, url));

const version = "0.4.0";
const targets = {
  "linux-x64": ["x86_64-unknown-linux-gnu", "x86_64-unknown-linux-musl"],
  "darwin-x64": ["x86_64-apple-darwin"],
};
const platform = `${process.platform}-${process.arch}`;
const bin = path.resolve(__dirname, "pio");

function downloadAndTest(target) {
  return request(
    `https://github.com/siiptuo/pio/releases/download/${version}/pio-${target}`
  ).then(
    (res) =>
      new Promise((resolve, reject) => {
        const file = fs.createWriteStream(bin);
        file.on("close", () => {
          try {
            fs.chmodSync(bin, 0o755);
            const output = execFileSync(bin, ["--version"], {
              encoding: "utf-8",
            }).trim();
            if (output !== `pio ${version}`) {
              throw new Error("wrong version");
            }
            resolve();
          } catch (error) {
            try {
              fs.unlinkSync(bin);
            } catch (error) {}
            reject(`failed to run pio: ${error.message}`);
          }
        });
        file.on("error", (err) => {
          try {
            fs.unlinkSync(bin);
          } catch (error) {}
          reject("downloading pio failed: " + err);
        });
        res.pipe(file);
      })
  );
}

async function main(targets) {
  if (targets.length === 0) {
    console.error("all binaries failed");
    process.exit(1);
  }
  try {
    console.log(`downloading ${targets[0]}...`);
    await downloadAndTest(targets[0]);
  } catch (error) {
    console.log(`error: ${error.message}`);
    return await main(targets.slice(1));
  }
}

if (!targets[platform]) {
  console.error(
    `prebuild pio binary is not available for your platform: ${platform}`
  );
  process.exit(1);
}

main(targets[platform]);
