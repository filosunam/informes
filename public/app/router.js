'use strict';

define([
  'app',
], function (app) {

  var Router = Backbone.Router.extend({
    initialize: function () {

    },
    routes: {
      '': 'index'
    },
    index: function () {

      app.useLayout('index').render();

    }
  });

  return Router;

});
