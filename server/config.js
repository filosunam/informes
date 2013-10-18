'use strict';

define(['underscore'], function (_) {

  var environment,
      defaults,
      development,
      production;

  defaults    = {
    rest: '/api/1.0/',
    port: 3000,
    session: {
      secret: 'P=~g8+Cf{Lz&HO,P',
      maxAge: (24 * 60 * 60 * 1000) * 3
    }
  };

  development = _.defaults({
    mongo: {
      user: '',
      pass: '',
      host: 'localhost',
      db: 'informes',
      url: 'mongodb://localhost:27017/informes'
    }
  }, defaults);

  production  = _.defaults({
    mongo: {
      user: '',
      pass: '',
      host: 'localhost',
      db: 'informes',
      url: 'mongodb://localhost:27017/informes'
    }
  }, defaults);

  if ('production' === process.env.NODE_ENV) {
    environment = production;
  } else {
    environment = development;
  }

  return environment;

});
