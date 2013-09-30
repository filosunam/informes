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
    denied: [
      'list',
      'admin/topics',
      'add/report',
    ],
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

      // set up views
      this.views = {
        topic: {
          list    : new Topic.Views.List(this.collections),
        },
        report: {
          list    : new Report.Views.List(this.collections),
          year    : new Report.Views.YearList(this.collections)
        }
      };

    },
    routes: {
      '': 'index',
      'help': 'help',
      'list': 'list',
      'admin/topics': 'admin',
      'add/report': 'editReport',
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
    editReport: function (id) {

      var self = this;

      this.years.fetch();
      this.topics.fetch();
      this.reports.fetch({
        success: function (collection) {

          var collections = _.clone(self.collections),
              options     = _.extend(collections, { model: collection.get(id) });

          app.layout.setView('#content', new Report.Views.Form(options));
          app.layout.render();

        }
      });

    },
    list: function () {

      this.years.fetch();
      this.topics.fetch();
      this.reports.fetch();

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
          path    = Backbone.history.fragment,
          denied  = _.contains(this.denied, path);

      this.user.getAuth(function (session, user) {

        if (denied && !user.auth) {

          self.go('/');

          app.trigger('message', {
            message: 'Debes iniciar sesión para poder continuar'
          });

        } else {

          //default layout
          app.useLayout('list').setViews({
            '#content'  : self.views.report.list,
            '#topics'   : self.views.topic.list,
            '#years'    : self.views.report.year
          }).render();

          next();

        }

      });

      return false;

    }
  });

  return Router;

});
