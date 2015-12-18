var fs = require('fs'),
  path = require('path'),
  babel = require('babel-core/register'),
  babelrc;

babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../.babelrc')));

babel(babelrc);

module.exports = require('./server').default;
