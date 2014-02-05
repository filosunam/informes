'use strict';

module.exports = function (grunt) {

  // crypto
  var crypto = require('crypto');

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
      },
      test: {
        options: {
          script: 'server.js',
          node_env: 'test'
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
        files: ['**/*.js', '!**/node_modules/**', '!public/components/**'],
        tasks: ['jshint']
      },
      preprocess: {
        files: ['public/_index.ejs'],
        tasks: ['preprocess:dev']
      },
      jst: {
        files: ['public/templates/**/*.html'],
        tasks: ['jst']
      },
      livereload: {
        options: { livereload: true },
        files: [
          'server/**/*',
          'public/**/*',
          '!public/templates/**/*',
          '!public/components/**'
        ]
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: 'public/app',
          name: 'main',
          mainConfigFile: 'public/app/main.js',
          out: 'public/js/app.js'
        }
      }
    },

    jst: {
      compile: {
        options: {
          processName: function (filename) {
            filename = filename.replace(/public\/templates\//, '');
            filename = filename.replace('.html', '');

            return filename;
          }
        },
        files: {
          "public/js/templates.js": ["public/templates/**/*.html"]
        }
      }
    },

    preprocess : {
      options: {
        context : { DEBUG: true }
      },
      dev: {
        src: 'public/_index.ejs',
        dest: 'public/index.ejs',
        options: {
          context: {
            script: 'app/main',
            node_env: 'development'
          }
        }
      },
      prod: {
        src: 'public/_index.ejs',
        dest: 'public/index.ejs',
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
      testing: ['test/**/*.js'],
      backend: ['Gruntfile.js', 'server/**/*.js'],
      frontend: {
        options: {
          globals: { requirejs: true }
        },
        files: {
          src: ['public/app/**/*.js']
        }
      }
    },

    nodeunit: {
      all: ['test/**/*.js']
    },

    release: {
      options: {
        commit: false,
        push: false,
        pushTags: false,
        npm: false,
        commitMessage: 'Release <%= version %>',
        tagMessage: 'Version <%= version %>'
      }
    },

    prompt: {
      users: {
        options: {
          questions: [
            {
              config: 'config.params.users.file',
              type: 'input',
              message: '¿Cuál es la ubicación del archivo?',
              default: './tmp/sheet.json'
            },
            {
              config: 'config.params.users.output',
              type: 'input',
              message: '¿Cuál es la ubicación del archivo por crear?',
              default: './tmp/users.json'
            },
            {
              config: 'config.params.users.admin.lastname',
              type: 'input',
              message: '¿Cuáles son los apellidos del administrador?',
              default: 'Godínez Bustos'
            },
            {
              config: 'config.params.users.admin.firstname',
              type: 'input',
              message: '¿Cuál es el nombre del administrador?',
              default: 'Marco'
            },
            {
              config: 'config.params.users.admin.email',
              type: 'email',
              message: '¿Cuál es el correo electrónico del administrador?',
              default: 'mgodinez@filos.unam.mx'
            },
            {
              config: 'config.params.users.admin.password',
              type: 'password',
              message: '¿Cuál es la contraseña del administrador?',
              default: '12345'
            },
            {
              config: 'config.params.users.fields.firstname',
              type: 'input',
              message: '¿Cuál es la llave del campo "Nombre"?',
              default: 'Nombre'
            },
            {
              config: 'config.params.users.fields.lastname',
              type: 'input',
              message: '¿Cuál es la llave del campo "Apellidos"?',
              default: 'Apellidos'
            },
            {
              config: 'config.params.users.fields.email',
              type: 'input',
              message: '¿Cuál es la llave del campo "Correo electrónico"?',
              default: 'Correo-e'
            },
            {
              config: 'config.params.users.fields.password',
              type: 'input',
              message: '¿Cuál es la llave del campo "Contraseña"?',
              default: 'Contraseña'
            },
            {
              config: 'config.params.users.fields.guidelines',
              type: 'input',
              message: '¿Cuál es la llave del campo "Guías"?',
              default: 'Guías'
            }
          ]
        }
      },
    }

  });

  grunt.registerTask('server', function (target) {
    
    if (target === 'test') {
      grunt.log.subhead('Test mode tasks');
      grunt.task.run(['preprocess:prod', 'express:test', 'nodeunit']);
    }

    if (target === 'production') {
      grunt.log.subhead('Production mode tasks');
      grunt.task.run(['preprocess:prod', 'express:prod']);
    }

    if (target === 'development' || !target) {
      grunt.log.subhead('Development mode tasks');
      grunt.task.run(['preprocess:dev', 'express:dev', 'watch']);
    }

  });

  grunt.registerTask('users', function () {

    var params = grunt.config.get('config.params.users');

    var sha = crypto.createHash('sha256');

    var output  = [{
      role: 'Administrator',
      name: {
        first: params.admin.firstname,
        last: params.admin.lastname
      },
      email: params.admin.email,
      password: sha.update(params.admin.password).digest('hex')
    }];

    if (grunt.file.isFile(params.file)) {
      grunt.file.readJSON(params.file).forEach(function (user) {
        
        var sha = crypto.createHash('sha256');

        output.push({
          role: 'Reporter',
          name: {
            first: user[params.fields.firstname],
            last: user[params.fields.lastname]
          },
          email: user[params.fields.email],
          password: sha.update(user[params.fields.password]).digest('hex'),
          guidelines: user[params.fields.guidelines]
        });
      });

      grunt.file.write(params.output, JSON.stringify(output));
    }
  });

  // Build users json file
  grunt.registerTask('build:users', ['prompt:users', 'users']);

  // Build production files
  grunt.registerTask('build', ['preprocess:prod', 'jst', 'requirejs']);

};
