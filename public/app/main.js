'use strict';

requirejs.config({
  baseUrl: 'app/',
  paths: {
    jquery: '../components/jquery/jquery.min',
    bootstrap: '../components/bootstrap/dist/js/bootstrap.min'
  },
  shim: {
    bootstrap: {
      deps: ['jquery']
    },
    app: {
      deps: ['bootstrap']
    }
  }
});

require(['app'], function (app) {

});
