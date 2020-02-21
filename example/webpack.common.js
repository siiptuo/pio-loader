// SPDX-FileCopyrightText: 2020 Tuomas Siipola
// SPDX-License-Identifier: CC0-1.0

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      title: "pio-loader example"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp)$/i,
        use: ["file-loader"]
      }
    ]
  }
};
