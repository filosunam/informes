'use strict';

module.exports = function (grunt) {
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

  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('server', function (target) {
    
    if (target === 'production') {
      grunt.log.subhead('Start server in production mode');
      grunt.task.run(['express:prod']);
    }

    if (target === 'development' || !target) {
      grunt.log.subhead('Start server in development mode');
      grunt.task.run(['express:dev']);
    }

  });

};
