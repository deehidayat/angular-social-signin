'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.initConfig({
    wiredep: {
      target: {
        src: 'demo/index.html' // point to your HTML file.
      }
    }
  });
};
