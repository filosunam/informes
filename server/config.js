'use strict';

define(['underscore'], function (_) {

  var environment,
      defaults,
      development,
      production;

  defaults    = {
    port: 3000
  };

  development = _.extend(defaults, {
    mongo: {
      user: '',
      pass: '',
      host: 'localhost',
      port: 27017,
      db: 'informes'
    }
  });
  production  = _.extend(defaults, {});

  if ('production' === process.env.NODE_ENV) {
    environment = production;
  } else {
    environment = development;
  }

  return environment;

});
