'use strict';

requirejs.config({
  baseUrl: 'app/',
  paths: {
    jquery: '../components/jquery/jquery.min',
    bootstrap: '../components/bootstrap/dist/js/bootstrap.min',
    underscore: '../components/underscore/underscore-min',
    backbone: '../components/backbone/backbone-min',
    marionette: '../components/backbone.marionette/lib/backbone.marionette.min',
    templates: '../js/templates',
    notify: '../components/bootstrap.notify/js/bootstrap-notify',
    moment: '../components/momentjs/min/moment+langs.min',
    markdown: '../components/markdown/lib/markdown'
  },
  shim: {
    app: ['marionette', 'bootstrap'],
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    notify: {
      deps: ['jquery'],
    },
    marionette: {
      deps: ['backbone', 'templates', 'notify', 'moment', 'markdown'],
      exports: 'Marionette'
    },
    markdown: { exports: 'markdown' },
    bootstrap: ['jquery']
  }
});

require([
  'app',
  'router',
  'controller'
], function (app, Router, Controller) {
  
  // Initializer
  app.addInitializer(function () {

    // Router
    app.router = new Router({
      // Controller
      controller: new Controller()
    });

    // Cross Domain
    app.csrf = $("meta[name='csrf-token']").attr("content");
    Backbone.sync = (function (original) {
      return function (method, model, options) {
        options.beforeSend = function (xhr) {
          xhr.setRequestHeader('X-CSRF-Token', app.csrf);
        };
        original(method, model, options);
      };
    })(Backbone.sync);

    // Config language of moment.js
    moment.lang('es');

  });

  // Start
  app.start({
    root: window.location.pathname,
    path_root: '/'
  });

});
