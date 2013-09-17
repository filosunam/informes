'use strict';

define(['app'], function (app) {

  var Session = app.module();

  Session.Model = Backbone.Model.extend({
    idAttribute: 'user',
    url: '/session',
    login: function (credentials) {
      this.save(credentials, {
        success: function () {
          app.router.go('list');
        },
        error: function () {

          app.trigger('message', {
            message: 'No es posible iniciar sesión. Verifica tus datos.'
          });
          
          app.router.go('/');
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

          // Reset collections
          app.router.reset();

          that.set({ auth: false, user: null });
          app.router.go('/');
        }
      });
    },
    getAuth: function (callback) {
      this.fetch({
        success: callback
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
    },
    serialize: function () {
      return {
        auth: this.model.get('auth'),
        user: this.model.get('user')
      };
    }
  });

  return Session;

});
