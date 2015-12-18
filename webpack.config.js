var path = require('path'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './lib/client/app'
  },
  output: {
    path: path.join(__dirname, 'lib/dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  resolve: {
    modulesDirectories: [
      path.join(__dirname, 'node_modules')
    ]
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: ExtractTextPlugin.extract('css!less') },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.(png|eot|woff2|woff|ttf|svg)$/, loader: 'file' },
      { test: /\.html$/, loader: 'html' }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ]
};
