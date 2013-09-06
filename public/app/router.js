'use strict';

define([
  'app',
], function (app) {

  var Router = Backbone.Router.extend({
    initialize: function () {

    },
    routes: {
      '': 'index',
      'help': 'help',
      'topics': 'topics',
    },
    index: function () {

      app.useLayout('index').render();

    },
    help: function () {

      app.useLayout('help').render();

    },
    topics: function () {

      app.useLayout('topics').render();

    }
  });

  return Router;

});
