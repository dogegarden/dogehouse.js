#!/usr/bin/env node

import { randomString } from '.';

function printRandom() {
	process.stdout.write(randomString(16));
	setTimeout(printRandom, 1)
}

printRandom();
