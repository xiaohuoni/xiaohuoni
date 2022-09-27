#!/usr/bin/env node
const { join } = require('path');

const { sync } = require('@umijs/utils/compiled/cross-spawn');
const chalk = require('@umijs/utils/compiled/chalk').default;
const argv = process.argv.slice(2);

process.env.KONO_PRESET = join(__dirname, `../src/preset`);

const spawn = sync(
  'konos',
  [...argv],
  {
    env: process.env,
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  }
);

if (spawn.status !== 0) {
  console.log(chalk.red(`kono-scripts run fail`));
  process.exit(1);
}
