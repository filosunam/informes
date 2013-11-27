'use strict';

define([
  'app',
  'layout',
  'modules/user',
  'modules/topic',
  'modules/year',
  'modules/report'
], function (app, Layout, User, Topic, Year, Report) {

  // Initializer
  app.addInitializer(function () {

    // Set Collections
    app.collections = {
      topics: new Topic.Collection(),
      years: new Year.Collection(),
      reports: new Report.Collection(),
      users: new User.Collection()
    };

    // Set Main Layout
    app.layout = new Layout.Main();

    // Set Header Layout
    app.layout.header = new Layout.Header();

    // Set Footer Layout
    app.layout.footer = new Layout.Footer();

  });

  var Controller = Marionette.Controller.extend({

    initialize: function () {

      // Show header
      app.header.show(app.layout.header);

      // Show footer
      app.footer.show(app.layout.footer);

    },

    reports: function () {
      
      // Fetches
      this.fetches();

      // Show reports
      app.layout.content.show(new Report.Layout(app.collections));
      
    },

    editReport: function (id) {

      // Fetches
      this.fetches();

      // Show report form
      app.collections.reports.fetch({
        success: function (collection) {
          
          // New or modify report
          var model = new Report.Model();
          
          if (id) {
            model = collection.get(id);
          }

          // Show report details
          app.layout.content.show(new Report.Details({ model: model }));
        }
      });

    },

    users: function () {

      // Show users layout
      app.main.show(new User.Layout(app.collections));

    },

    editUser: function (id) {

      var layout = new User.Layout(app.collections);

      // Show user layout
      app.main.show(layout);

      // Show user form
      app.collections.users.fetch({
        success: function (collection) {
          
          // New or modify user
          var model = new User.Model();
          
          if (id) {
            model = collection.get(id);
          }

          // Show user details
          layout.details.show(new User.Views.Details({ model: model }));
        }
      });

    },

    fetches: function () {

      // Show main layout
      app.main.show(app.layout);

      // Show topics
      app.layout.topics.show(new Topic.Layout(app.collections));

      // Show years
      app.collections.years.fetch({
        success: function (collection) {
          app.layout.years.show(new Year.Views.List({
            collection: collection
          }));
        }
      });

      // Show users
      app.collections.users.fetch({
        success: function (collection) {
          app.layout.users.show(new User.Views.SelectList({
            collection: collection
          }));
        }
      });

    },

    // index
    index: function () {

      this.showSimpleView('index');

    },

    // help
    help: function () {

      this.showSimpleView('help');

    },

    // Show simple view
    showSimpleView: function (template) {

      var View = Marionette.ItemView.extend({
        template: template
      });

      app.main.show(new View());

    }

  });

  return Controller;

});
