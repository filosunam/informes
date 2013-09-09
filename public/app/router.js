'use strict';

define([
  'app',
  'modules/session',
  'modules/report',
  'modules/topic'
], function (app, Session, Report, Topic) {

  var Router = Backbone.Router.extend({
    initialize: function () {

      // Session
      this.user = new Session.Model();

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
        "#users": new Session.Views.Form({ model: this.user }),
      };

      _.extend(this, this.collections);

    },
    routes: {
      '': 'index',
      'help': 'help',
      'topics': 'topics',
    },
    go: function () {
      return this.navigate(_.toArray(arguments).join("/"), true);
    },
    index: function () {

      app.useLayout('index').render();

    },
    help: function () {

      app.useLayout('help').render();

    },
    topics: function () {

      if (this.user.get('auth')) {

        this.topics.fetch();
        this.reports.fetch();
        this.years.fetch();

        app.useLayout('topics').setViews(this.views).render();

      }

    }
  });

  return Router;

});
