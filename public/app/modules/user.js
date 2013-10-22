'use strict';

define(['app'], function (app) {

  var User = {
    url: app.rest + '/users',
    Views: {}
  };

  // User Model
  User.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: User.url,
    defaults: {
      _id: null,
      email: null,
      role: null,
      created_at: null,
      updated_at: null,
      password: null
    },
    initialize: function () {
      this.listenTo(this, {
        destroy: function () {
          app.trigger('notify', {
            message: { text: 'Se ha eliminado el usuario.' }
          });
        }
      });
    }
  });

  // User Collection
  User.Collection = Backbone.Collection.extend({
    model: User.Model,
    url: User.url
  });

  // User Item
  User.Views.Item = Marionette.ItemView.extend({
    tagName: 'tr',
    template: 'user/item'
  });

  // User List
  User.Views.List = Marionette.CompositeView.extend({
    tagName: 'table',
    className: 'table table-striped table-hover',
    template: 'user/table',
    itemView: User.Views.Item,
    itemViewContainer: ".items"
  });

  // User Select Item
  User.Views.SelectItem = Marionette.ItemView.extend({
    tagName: 'option',
    template: 'user/select-item',
    onRender: function () {
      $(this.el).prop('value', this.model.get('_id'));
    }
  });

  // User Select List
  User.Views.SelectList = Marionette.CollectionView.extend({
    tagName: 'select',
    className: 'form-control',
    itemView: User.Views.SelectItem,
    events: {
      change: 'filters'
    },
    filters: function (e) {
      this.filterYears(e);
      this.filterTopics(e);
      this.filterReports(e);
    },
    filterReports: function (e) {

      var option  = $(e.currentTarget).find('option:selected').val(),
          reports = app.collections.reports;

      if (option === reports.filter_user) {
        delete reports.filter_user;
      } else {
        reports.filter_user = option;
      }

      reports.fetch();

      return false;

    },
    filterTopics: function (e) {

      var option  = $(e.currentTarget).find('option:selected').val(),
          topics  = app.collections.topics;

      if (option === topics.filter_user) {
        delete topics.filter_user;
      } else {
        topics.filter_user = option;
      }

      topics.fetch();

      return false;

    },
    filterYears: function (e) {

      var option  = $(e.currentTarget).find('option:selected').val(),
          years  = app.collections.years;

      if (option === years.filter_user) {
        delete years.filter_user;
      } else {
        years.filter_user = option;
      }

      years.fetch();

      return false;

    },
    onRender: function () {
      $(this.el).prepend('<option value="">Todos los usuarios</option>');
    }
  });

  // User Details
  User.Views.Details = Marionette.ItemView.extend({
    template: 'user/edit',
    events: {
      'submit form': 'saveUser',
      'click .remove': 'removeUser'
    },
    removeList: function () {
      var that    = this,
          model   = null,
          users = [];

      _.each(this.$el.find('input:checked'), function (user) {
        model = that.options.users.get($(user).val());
        model.destroy();
      });
    },
    removeUser: function () {
      this.model.destroy({
        success: function () {
          app.router.navigate('#/users');
        }
      });
    },
    saveUser: function () {

      var form = $(this.el),
          id   = form.find('#user-id').val();

      var data = {
        name        : {
          first     : form.find('#user-firstname').val(),
          last      : form.find('#user-lastname').val(),
        },
        email       : form.find('#user-email').val(),
        role        : form.find('#user-role').val(),
        updated_at  : new Date()
      };

      if (!id) {
        data.created_at = new Date();
      }

      if (form.find('#user-password').val()) {
        data.password = form.find('#user-password').val();
      }

      this.model.save(data, {
        success: function (model) {
          app.router.navigate('#/users');

          if (id) {
            app.trigger('notify', {
              message: { text: 'Se ha modificado el usuario.' }
            });
          } else {
            app.trigger('notify', {
              message: { text: 'Se ha creado el usuario.' }
            });
          }
        },
        error: function (model, resp) {

          // show all server errors
          _.each(resp.responseJSON.errors, function (error) {
            app.trigger('notify', {
              message: { text: error.message }
            });
          });

        }
      });

      return false;
    }
  });

  // Users Layout
  User.Layout = Marionette.Layout.extend({
    template: 'users',
    regions: {
      users: '#users',
      details: '#details'
    },
    events: {
      'click .remove-list': 'removeList'
    },
    removeList: function () {
      if (confirm('¿Estás seguro?')) {
        var that    = this,
            model   = null,
            users = [];

        _.each(this.$el.find('input:checked'), function (user) {
          model = that.options.users.get($(user).val());
          model.destroy();
        });
      }
    },
    onRender: function () {

      var that = this;

      // list users
      app.collections.users.fetch({
        success: function (collection) {
          that.users.show(new User.Views.List({
            collection: collection
          }));
        }
      });

    }
  });

  return User;

});
