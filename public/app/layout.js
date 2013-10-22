'use strict';

define([
  'app',
  'modules/session'
], function (app, Session) {

  var Layout = {};

  // Main Layout
  Layout.Main = Marionette.Layout.extend({
    template: 'reports',
    regions: {
      users: '#users',
      years: '#years',
      topics: '#topics',
      content: '#content'
    },
    serializeData: function () {
      // Serialize user data to main layout
      return {
        user: app.user.get('user')
      };
    }
  });

  // Header Layout
  Layout.Header = Marionette.Layout.extend({
    template: 'header',
    regions: { panel: '#panel' },
    onRender: function () {

      var panel = this.panel;

      app.user = new Session.Model();
      app.user.fetch({
        success: function (user) {
          if (user.get('auth')) {
            // Show panel if the user are currently logged
            panel.show(new Session.Views.Logout({ model: user }));
          } else {
            // Show form if the user isn't logged
            panel.show(new Session.Views.Login({ model: user }));
          }
        }
      });
    }
  });

  return Layout;

});
