'use strict';

define(['app'], function (app) {

  var Session = {
    Views: {}
  };

  Session.Model = Backbone.Model.extend({
    idAttribute: 'user',
    url: '/session',
    login: function (credentials) {
      this.save(credentials, {
        success: function () {
          app.router.navigate('#/reports');
        },
        error: function () {

          app.trigger('message', {
            message: 'No es posible iniciar sesión. Verifica tus datos.'
          });

          app.router.navigate('#/');
        }
      });
    },
    logout: function () {
      var that = this;
      this.destroy({
        success: function (model, resp) {
          model.clear();
          model.id = null;

          // Refresh Csrf Token
          app.csrf = resp.csrf;

          // Refresh model
          that.set({ auth: false, user: null });

          // Redirect to home
          app.router.navigate('#/');
        }
      });
    },
    getAuth: function (callback) {
      this.fetch({
        success: callback
      });
    }
  });

  Session.Views.Login = Marionette.ItemView.extend({
    template: 'user/login',
    events: {
      'submit form': 'login'
    },
    login: function (e) {
      e.preventDefault();

      this.model.login({
        email     : $(this.el).find('#email').val(),
        password  : $(this.el).find('#password').val()
      });
    },
    initialize: function () {
      this.listenTo(this.model, {
        'change:auth': app.layout.header.render
      });
    }
  });

  Session.Views.Logout = Marionette.ItemView.extend({
    template: 'user/logout',
    events: {
      'click .logout': 'logout'
    },
    logout: function (e) {
      e.preventDefault();
      this.model.logout();
    },
    initialize: function () {
      this.listenTo(this.model, {
        'change:auth': app.layout.header.render
      });
    }
  });

  return Session;

});
