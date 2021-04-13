#!/usr/bin/env node


Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");

function printRandom() {
  process.stdout.write(_1.randomString(16));
  setTimeout(printRandom, 1);
}
printRandom();
