'use strict';

define(['app'], function (app) {

  var Session = app.module();

  Session.Model = Backbone.Model.extend({
    idAttribute: 'user',
    url: '/session',
    login: function (credentials) {
      this.save(credentials);
    },
    logout: function () {
      var that = this;
      this.destroy({
        success: function (model, resp) {
          model.clear();
          model.id = null;

          // Refresh Csrf Token
          app.csrf = resp.csrf;

          that.set({ auth: false, user: null });
        }
      });
    }
  });

  Session.Views.Form = Backbone.View.extend({
    scope: '#users',
    initialize: function () {

      // form out of main element
      $(this.scope).html(this.el);

      var that = this;

      this.listenTo(this.model, {
        'change:auth': this.render
      });

    },
    beforeRender: function () {
      if (this.model.get('auth')) {
        this.template = 'user/logout';
      } else {
        this.template = 'user/login';
      }
    },
    events: {
      'submit form': 'login',
      'click .logout': 'logout'
    },
    login: function (e) {
      e.preventDefault();

      this.model.login({
        email: $(this.el).find('#email').val(),
        password: $(this.el).find('#password').val()
      });

    },
    logout: function (e) {
      e.preventDefault();
      this.model.logout();
    }
  });

  return Session;

});
