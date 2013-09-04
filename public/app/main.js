'use strict';

requirejs.config({
  baseUrl: 'app/',
  paths: {
    jquery: '../components/jquery/jquery.min',
    bootstrap: '../components/bootstrap/dist/js/bootstrap.min',
    underscore: '../components/underscore/underscore-min',
    backbone: '../components/backbone/backbone-min',
    layoutmanager: '../components/layoutmanager/backbone.layoutmanager',
  },
  shim: {
    "*": ['backbone'],
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    layoutmanager: {
      deps: ["backbone"],
      exports: 'Backbone.Layout'
    },
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
