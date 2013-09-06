'use strict';

define([
  'app',
  'modules/report'
], function (app, Report) {

  var Router = Backbone.Router.extend({
    initialize: function () {

      // set up collections
      this.collections = {
        reports: new Report.Collection()
      };

      // set up views
      this.views = {
        "#reports": new Report.Views.List(this.collections)
      };

      _.extend(this, this.collections);

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

      this.reports.fetch();
      app.useLayout('topics').setViews(this.views).render();

    }
  });

  return Router;

});
