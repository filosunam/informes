'use strict';

module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    express: {
      options: {
        delay: 1000
      },
      dev: {
        options: {
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          background: false,
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
      scripts: {
        files: ['**/*.js', '!**/node_modules/**'],
        tasks: ['jshint']
      },
      preprocess: {
        files: ['public/_index.html'],
        tasks: ['preprocess:dev']
      },
      livereload: {
        options: { livereload: true },
        files: [
          'server/**/*',
          'public/**/*',
          '!public/components/**'
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
      frontend: {
        options: {
          globals: { requirejs: true }
        },
        files: {
          src: ['public/app/**/*.js']
        }
      }
    }

  });

  grunt.registerTask('server', function (target) {
    
    if (target === 'production') {
      grunt.log.subhead('Production mode tasks');
      grunt.task.run(['preprocess:prod', 'express:prod']);
    }

    if (target === 'development' || !target) {
      grunt.log.subhead('Development mode tasks');
      grunt.task.run(['preprocess:dev', 'express:dev', 'watch']);
    }

  });

  grunt.registerTask('build', ['preprocess:prod']);

};
