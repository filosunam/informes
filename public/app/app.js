'use strict';

define(['marionette'], function (Marionette) {

  var App = new Marionette.Application();

  // Regions
  App.addRegions({
    header  : '#header',
    main    : '#main'
  });

  // After initialize
  App.on('initialize:after', function (options) {
    Backbone.history.start();

    // Messages
    App.bind('message', function (object) {
      var el = $('#message');
      el.find('.message').html(object.message);
      el.modal({ show: true });
    });

    // Notifications
    App.bind('notify', function (options) {
      $('.notifications').notify(_.extend({
        closable: false,
        type: 'default',
        message: { text: 'Hecho.' }
      }, options)).show();
    });

  });

  // Templates
  Marionette.Renderer.render = function (template, data) {
    if (!JST[template]) {
      throw "Template '" + template + "' not found!";
    }
    return JST[template](data);
  };

  // Rest API Version
  App.rest = 'api/1.0';

  return App;

});
