// SPDX-FileCopyrightText: 2020 Tuomas Siipola
// SPDX-License-Identifier: CC0-1.0

import cat from "./cat.jpg";
import webp from "./cat.jpg?format=webp&quality=50";

const img1 = new Image();
img1.src = cat;
document.body.appendChild(img1);

const img2 = new Image();
img2.src = webp;
document.body.appendChild(img2);
