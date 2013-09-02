'use strict';

var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require,
  baseUrl: __dirname + '/server'
});

requirejs(['config', 'express'], function(config, express){

  var server  = module.exports = express(),
      listen  = server.listen(process.env.PORT || config.port),
      fs      = require('fs');

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

    // default html file
    server.use(function (req, res) {
      var contents = fs.readFileSync(__dirname + '/public/index.html');
      res.send(contents.toString());
    });
  });

  // development
  server.configure('development', function () {
    this.use(express.logger('dev'));
    this.use(express.errorHandler());
  });

  // production
  server.configure('production', function () {
    this.use(express.logger());
    this.enable('view cache');
  });

});
