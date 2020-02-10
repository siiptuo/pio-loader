// SPDX-FileCopyrightText: 2020 Tuomas Siipola
// SPDX-License-Identifier: CC0-1.0

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp)$/i,
        use: [
          "file-loader",
          {
            loader: "../index.js",
            options: {}
          }
        ]
      }
    ]
  }
};
