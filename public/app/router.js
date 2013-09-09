'use strict';

define([
  'app',
  'modules/session',
  'modules/report',
  'modules/topic'
], function (app, Session, Report, Topic) {

  var Router = Backbone.Router.extend({
    initialize: function () {

      // session
      this.user       = new Session.Model();
      this.user.form  = new Session.Views.Form({ model: this.user });

      this.user.fetch();
      this.user.form.render();

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

      } else {

        this.go('login');
        
      }

    }
  });

  return Router;

});
