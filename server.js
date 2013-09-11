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
  'models/index',
  'connections/passport',
  'connections/local'
], function(config, express, auth, models, passport, localStrategy){

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
    server.use(express.session({
      secret: 'P=~g8+Cf{Lz&HO,P',
      cookie: { maxAge: 18000000 }
    }));
    server.use(passport.initialize());
    server.use(passport.session());

    // compiling less files
    server.use(require('less-middleware')({
      src: __dirname + '/public',
      yuicompress: true
    }));

    // ejs for main file
    server.set("view engine", "ejs");
    server.set('views', __dirname + '/public');

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

    // csrf token
    server.use(express.csrf());
    server.use(function (req, res, next) {
      var csrf = req.csrfToken();
      res.setHeader('X-CSRF-Token', csrf);
      res.locals.csrf = csrf;
      next();
    });
  });

  // router
  server.use(server.router);

  // main route
  server.get('/', function (req, res) {
    res.render('index');
  });

  // login
  server.post('/session', passport.authenticate('local'), function (req, res) {
    res.send({
      auth: true,
      user: req.user
    });
  });

  // get session
  server.get("/session", function (req, res) {
    if (req.isAuthenticated()) {
      res.send({
        auth: true,
        user: req.user
      });
    } else {
      res.send({
        auth: false
      });
    }
  });

  // logout
  server.del('/session', function (req, res) {
    req.logout();
    res.send({
      auth: false,
      csrf: 'development' === server.get('env') ? null : req.csrfToken()
    });
  });

  // rest api
  models.forEach(function (model) {
    model.register(server, config.rest + model.slug || model.modelName);
  });

});
