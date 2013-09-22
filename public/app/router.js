'use strict';

define([
  'app',
  'base',
  'modules/session',
  'modules/report',
  'modules/topic'
], function (app, BaseRouter, Session, Report, Topic) {

  app.bind('message', function (object) {
    var el = $('#message');
    el.find('.message').html(object.message);
    el.modal({ show: true });
  });

  var Router = BaseRouter.extend({
    denied: ['#/list'],
    initialize: function () {

      // session
      this.user       = new Session.Model();
      this.user.form  = new Session.Views.Form({ model: this.user });
      this.user.fetch();

      // set up collections
      this.collections = {
        years     : new Report.YearCollection(),
        reports   : new Report.Collection(),
        topics    : new Topic.Collection(),
      };

      _.extend(this, this.collections);

    },
    routes: {
      '': 'index',
      'help': 'help',
      'list': 'list',
      'admin/topics': 'admin',
      'add/report': 'addReport',
      'edit/report/:id': 'editReport'
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
    addReport: function () {
      this.list();

      app.layout.setView("#content", new Report.Views.Form());
      app.layout.render();
    },
    editReport: function (id) {
      this.list();

      app.layout.setView("#content", new Report.Views.Form({ model: this.reports.get(id) }));
      app.layout.render();

    },
    list: function () {

      this.years.fetch();
      this.topics.fetch();
      this.reports.fetch();

      app.useLayout('list').setViews({
        "#years"    : new Report.Views.YearList(this.collections),
        "#content"  : new Report.Views.List(this.collections),
        "#reports"  : new Report.Views.Table(this.collections),
        "#topics"   : new Topic.Views.List(this.collections)
      }).render();

    },
    admin: function () {

      this.list();

      app.layout.setView("#topics", new Topic.Views.AdminList(this.collections));
      app.layout.render();

    },
    reset: function () {
      if (this.topics.length) {
        this.topics.reset();
      }

      if (this.reports.length) {
        this.reports.reset();
      }

      if (this.years.length) {
        this.years.reset();
      }
    },
    before: function (params, next) {

      var self    = this,
          path    = Backbone.history.location.hash,
          denied  = _.contains(this.denied, path);

      this.user.getAuth(function (session, user) {

        if (denied && !user.auth) {

          self.go('/');

          app.trigger('message', {
            message: 'Debes iniciar sesión para poder continuar'
          });

        } else { next(); }

      });

      return false;

    }
  });

  return Router;

});
