// SPDX-FileCopyrightText: 2020 Tuomas Siipola
// SPDX-License-Identifier: CC0-1.0

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp)$/i,
        use: ["file-loader"],
      },
    ],
  },
});
