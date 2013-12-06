'use strict';

define(['app', 'baserouter'], function (app, BaseRouter) {

  var Router = BaseRouter.extend({

    // Denied Routes
    denied: [
      'users',
      'users/add',
      'users/edit/:id',
      'reports',
      'reports/add',
      'reports/edit/:id'
    ],

    // Routes
    appRoutes: {
      '': 'index',
      'help': 'help',
      'users': 'users',
      'users/add': 'editUser',
      'users/edit/:id': 'editUser',
      'reports': 'reports',
      'reports/add': 'editReport',
      'reports/edit/:id': 'editReport'
    },

    // Filter routes (for auth purposes)
    before: function (params, next) {

      var that    = this,
          path    = Backbone.history.fragment,
          denied  = _.contains(this.denied, path);

      // Get auth
      app.user.getAuth(function (session, user) {

        if (denied && !user.auth) {

          that.navigate('#/');

          app.trigger('message', {
            message: 'Debes iniciar sesión para poder continuar'
          });

        } else {

          // Next if auth is true
          next();
        }

      });

    }


  });

  return Router;

});
