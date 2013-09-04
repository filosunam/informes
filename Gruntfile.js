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
    },

    watch: {
      express: {
        files: ['server.js', 'server/**/*.js'],
        tasks: ['express:dev'],
        options: { nospawn: true }
      },
      preprocess: {
        files: ['public/_index.html'],
        tasks: ['preprocess:dev']
      },
      livereload: {
        options: { livereload: true },
        files: [
          'server/**/*',
          'public/app/**/*',
          'public/templates/**/*',
          'public/index.html'
        ]
      }
    },

    preprocess : {
      options: {
        context : { DEBUG: true }
      },
      dev: {
        src: 'public/_index.html',
        dest: 'public/index.html',
        options: {
          context: {
            script: 'app/main',
            node_env: 'development'
          }
        }
      },
      prod: {
        src: 'public/_index.html',
        dest: 'public/index.html',
        options: {
          context: {
            script: 'js/app',
            node_env: 'production'
          }
        }
      }
    },

    jshint: {
      options: { jshintrc: '.jshintrc' },
      backend: ['Gruntfile.js', 'server/**/*.js'],
      frontend: ['public/app/**/*.js']
    }

  });

  grunt.registerTask('server', function (target) {
    
    if (target === 'production') {
      grunt.log.subhead('Production mode tasks');
      grunt.task.run(['express:prod']);
    }

    if (target === 'development' || !target) {
      grunt.log.subhead('Development mode tasks');
      grunt.task.run(['preprocess:dev', 'jshint', 'express:dev', 'watch']);
    }

  });

  grunt.registerTask('build', ['preprocess:prod']);

  grunt.event.on('watch', function (action, path) {
    grunt.task.run('jshint');
  });

};
