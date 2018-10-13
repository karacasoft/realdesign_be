"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cv = require("opencv4nodejs");
const img = cv.imread('../image.jpg', cv.IMREAD_COLOR);
const threshold = img.threshold(128, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
cv.imwrite('../image.bin.jpg', threshold);
