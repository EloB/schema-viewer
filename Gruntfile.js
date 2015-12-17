module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-publish');

  grunt.initConfig({
    publish: {
      main: {
        src: [
          '**/*'
        ]
      }
    }
  });
};