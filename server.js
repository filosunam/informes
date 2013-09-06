'use strict';

var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require,
  baseUrl: __dirname + '/server'
});

requirejs(['config', 'express'], function(config, express){

  var server  = module.exports = express(),
      listen  = server.listen(process.env.PORT || config.port);

  // all environments
  server.configure(function () {
    server.use(express.query());
    server.use(express.bodyParser());
    server.use(express.methodOverride());
    server.use(server.router);

    // compiling less files
    server.use(require('less-middleware')({
      src: __dirname + '/public',
      yuicompress: true
    }));

    // static files
    server.use(express.static(__dirname + '/public'));
  });

  // development
  server.configure('development', function () {
    server.use(express.logger('dev'));
    server.use(express.errorHandler());
  });

  // production
  server.configure('production', function () {
    server.use(express.logger());
    server.enable('view cache');
  });

  server.get('/api/1.0/reports', function (req, res) {
    res.send([
      {
        id: 1,
        year: 2013,
        title: 'Cursos',
        type: 'Valoración',
        topic: 'Cátedras',
        contents: '...',
        created_at: new Date(),
        update_at: new Date()
      },
      {
        id: 2,
        year: 2013,
        title: 'Cursos',
        type: 'Número',
        topic: 'Cátedras',
        contents: '...',
        created_at: new Date(),
        update_at: new Date()
      },
      {
        id: 3,
        year: 2013,
        title: 'Conferencias',
        type: 'Valoración',
        topic: 'Cátedras',
        contents: '...',
        created_at: new Date(),
        update_at: new Date()
      },
      {
        id: 4,
        year: 2012,
        title: 'Cursos',
        type: 'Valoración',
        topic: 'Cátedras',
        contents: '...',
        created_at: new Date(),
        update_at: new Date()
      },
    ]);
  });

});
