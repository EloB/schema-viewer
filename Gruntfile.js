var webpack = require('webpack'),
  webpackConfig = require('./webpack.config');

module.exports = function(grunt) {
  [
    'grunt-release',
    'grunt-webpack',
    'grunt-contrib-clean',
    'grunt-contrib-watch'
  ].forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['clean', 'webpack' ]);

  grunt.initConfig({
    release: {},
    clean: {
      dist: 'lib/dist'
    },
    webpack: {
      // production: (() => {
      //   webpackConfig.plugins.push(
      //     new webpack.optimize.UglifyJsPlugin({ minimize: true }),
      //     new webpack.optimize.DedupePlugin(),
      //     new webpack.DefinePlugin({
      //       'process.env': {
      //         NODE_ENV: JSON.stringify('production')
      //       }
      //     }),
      //     new webpack.NoErrorsPlugin()
      //   );
      //   return webpackConfig;
      // })(),
      development: webpackConfig
    },
    watch: {
      webpack: {
        tasks: ['webpack:development'],
        files: ['lib/client/**/*']
      }
    }
  });
};
