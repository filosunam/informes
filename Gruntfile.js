'use strict';

module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    express: {
      dev: {
        options: {
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          node_env: 'production'
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    
    if (target === 'production') {
      grunt.log.subhead('Production mode tasks');
      grunt.task.run(['express:prod']);
    }

    if (target === 'development' || !target) {
      grunt.log.subhead('Development mode tasks');
      grunt.task.run(['express:dev']);
    }

  });

};
