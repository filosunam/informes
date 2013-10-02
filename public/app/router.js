'use strict';

define([
  'app',
  'base',
  'modules/session',
  'modules/user',
  'modules/report',
  'modules/topic'
], function (app, BaseRouter, Session, User, Report, Topic) {

  app.bind('message', function (object) {
    var el = $('#message');
    el.find('.message').html(object.message);
    el.modal({ show: true });
  });

  app.bind('notify', function (options) {
    $('.notifications').notify(_.extend({
      closable: false,
      type: 'default',
      message: { text: 'Hecho.' }
    }, options)).show();
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
        users     : new User.Collection(),
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
        },
        user: {
          list    : new User.Views.List(this.collections) 
        }
      };

    },
    routes: {
      '': 'index',
      'help': 'help',
      'list': 'list',
      'add/report': 'editReport',
      'edit/report/:id': 'editReport',
      'users': 'users',
      'add/user': 'editUser',
      'edit/user/:id': 'editUser'
    },
    go: function () {
      return this.navigate(_.toArray(arguments).join("/"), true);
    },
    renderLayout: function (layout) {
      app.useLayout(layout).setViews({
        '#content'  : this.views.report.list,
        '#topics'   : this.views.topic.list,
        '#years'    : this.views.report.year
      }).render();
    },
    index: function () {
      app.useLayout('index').render();
    },
    help: function () {
      app.useLayout('help').render();
    },
    list: function () {

      this.renderLayout('list');

      this.years.fetch();
      this.topics.fetch();
      this.reports.fetch();

    },
    users: function () {

      this.users.fetch();

      app.useLayout('users').setViews({
        '#users': this.views.user.list
      }).render();

    },
    editReport: function (id) {

      var self = this;

      this.renderLayout('list');

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
    editUser: function (id) {

      var self = this;

      this.users.fetch({
        success: function (collection) {

          var options = _.extend(self.collections, { model: collection.get(id) });

          app.useLayout('users').setViews({
            '#users': self.views.user.list,
            '#details': new User.Views.Form(options)
          }).render();

        }
      });

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

      if (this.users.length) {
        this.users.reset();
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

        } else { next(); }

      });

      return false;

    }
  });

  return Router;

});
