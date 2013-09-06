'use strict';

var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require,
  baseUrl: __dirname + '/server'
});

requirejs([
  'config',
  'express',
  'auth',
  'connections/passport',
  'connections/local'
], function(config, express, auth, passport, localStrategy){

  var server  = module.exports = express(),
      listen  = server.listen(process.env.PORT || config.port);

  // local auth
  passport.use(localStrategy);

  // all environments
  server.configure(function () {
    server.use(express.query());
    server.use(express.bodyParser());
    server.use(express.cookieParser());
    server.use(express.methodOverride());
    server.use(express.session({ secret: 'keyboard cat' }));
    server.use(express.session({ cookie: { maxAge: 60000 }}));
    server.use(passport.initialize());
    server.use(passport.session());
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

  // authentication
  server.post('/login', passport.authenticate('local'), function (req, res) {
    res.send(req.user);
  });

  server.get('/logout', function(req, res){
    req.logout();
    res.send(200);
  });

  server.get('/api/1.0/topics', auth, function (req, res) {
    res.send([
      {
        id: 1,
        title: 'Cátedras',
        reports: [1,2,4]
      },
      {
        id: 2,
        title: 'Convenios',
        reports: [3,5]
      }
    ]);
  });

  server.get('/api/1.0/reports', auth, function (req, res) {
    res.send([
      {
        id: 1,
        year: 2013,
        title: 'Cursos',
        type: 'Valoración',
        topic: 'Cátedras',
        contents: '...',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        year: 2013,
        title: 'Cursos',
        type: 'Número',
        topic: 'Cátedras',
        contents: '...',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        year: 2013,
        title: 'Convenios',
        type: 'Valoración',
        topic: 'Convenios',
        contents: '...',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        year: 2012,
        title: 'Cursos',
        type: 'Valoración',
        topic: 'Cátedras',
        contents: '...',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        year: 2011,
        title: 'Profesores',
        type: 'Número',
        topic: 'Convenios',
        contents: '...',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  });

});
