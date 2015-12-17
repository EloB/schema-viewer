#!/usr/bin/env node

var program = require('commander')
  , path = require('path')
  , open = require('open')
  , pkg = require('../package')
  , app = require('../');

program
  .version(pkg.version)
  .parse(process.argv);

app.set('schemaPath', path.resolve(process.cwd(), program.args[0] || '.'));

app.start((err, url) => !err && open(url));