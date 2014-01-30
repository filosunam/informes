'use strict';

define(['marionette'], function (Marionette) {

  var App = new Marionette.Application();

  // Regions
  App.addRegions({
    header  : '#header',
    main    : '#main',
    footer  : '#footer'
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

  // Helpers
  Marionette.View.prototype.templateHelpers = function () {
    return {
      markdown: function (str) {
        // Compile markdown syntax
        return markdown.toHTML(str);
      }
    };
  };

  // Form Validation
  $.validator.setDefaults({
    errorElement: "span",
    highlight: function (element) {
      $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function (element) {
      $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
    }
  });

  $.extend($.validator.messages, {
    required: "Este campo es obligatorio.",
    remote: "Por favor, rellena este campo.",
    email: "Por favor, escribe una dirección de correo válida",
    url: "Por favor, escribe una URL válida.",
    date: "Por favor, escribe una fecha válida.",
    dateISO: "Por favor, escribe una fecha (ISO) válida.",
    number: "Por favor, escribe un número entero válido.",
    digits: "Por favor, escribe sólo dígitos.",
    creditcard: "Por favor, escribe un número de tarjeta válido.",
    equalTo: "Por favor, escribe el mismo valor de nuevo.",
    accept: "Por favor, escribe un valor con una extensión aceptada.",
    maxlength: $.validator.format("Por favor, no escribas más de {0} caracteres."),
    minlength: $.validator.format("Por favor, no escribas menos de {0} caracteres."),
    rangelength: $.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
    range: $.validator.format("Por favor, escribe un valor entre {0} y {1}."),
    max: $.validator.format("Por favor, escribe un valor menor o igual a {0}."),
    min: $.validator.format("Por favor, escribe un valor mayor o igual a {0}.")
  });

  // Rest API Version
  App.rest = 'api/1.0';

  return App;

});
