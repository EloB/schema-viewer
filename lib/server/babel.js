var fs = require('fs'),
  path = require('path'),
  babel = require('babel-register'),
  babelrc;

babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../.babelrc')));
babelrc.only = [__dirname];

babel(babelrc);

module.exports = require('./server').default;
