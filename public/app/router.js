'use strict';

define([
  'app',
  'modules/report',
  'modules/topic'
], function (app, Report, Topic) {

  var Router = Backbone.Router.extend({
    initialize: function () {

      // set up collections
      this.collections = {
        years: new Report.YearCollection(),
        reports: new Report.Collection(),
        topics: new Topic.Collection(),
      };

      // set up views
      this.views = {
        "#years": new Report.Views.YearList(this.collections),
        "#reports": new Report.Views.List(this.collections),
        "#topics": new Topic.Views.List(this.collections),
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

      this.topics.fetch();
      this.reports.fetch();
      this.years.fetch();

      app.useLayout('topics').setViews(this.views).render();

    }
  });

  return Router;

});
