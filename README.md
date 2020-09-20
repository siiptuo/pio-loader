<!--
SPDX-FileCopyrightText: 2020 Tuomas Siipola
SPDX-License-Identifier: ISC
-->

# pio-loader

[Perceptual image optimizer](https://github.com/siiptuo/pio) for webpack.

## Getting started

`pio-loader` is not yet published on npm but you can install it from GitHub by running:

```sh
$ npm install --save-dev siiptuo/pio-loader
```

Most likely you also want to use [`file-loader`](https://github.com/webpack-contrib/file-loader):

```sh
$ npm install --save-dev file-loader
```

Add `file-loader` and `pio-loader` to your `webpack.config.js`:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp)$/i,
        use: ["file-loader", "pio-loader"],
      },
    ],
  },
};
```

Now imported images are automatically optimized:

```js
import cat from "./cat.jpg";

const img = new Image();
img.src = cat;
document.body.appendChild(img);
```

See [`example`](example) directory for full example which for instance shows how to disable optimization during development.

## Settings

Set the default quality in `webpack.config.js`:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp)$/i,
        use: [
          "file-loader",
          {
            loader: "pio-loader",
            settings: { quality: 75 },
          },
        ],
      },
    ],
  },
};
```

You can override the default quality per import:

```js
import cat from "./cat.jpg?quality=95";
```

It's also possible to use different output format:

```js
import cat from "./cat.jpg?format=webp";
```

## License

ISC
