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
      guidelines: null,
      created_at: null,
      updated_at: null,
      password: null,
      lastaccess: null
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
      if (this.options.filters !== false) {
        
        var filter = $(e.currentTarget).find('option:selected').val();

        this.setFilter(filter, app.collections.years);
        this.setFilter(filter, app.collections.topics);
        this.setFilter(filter, app.collections.reports);
      
      }
    },
    setFilter: function (filter, collection) {
      if (filter === collection.filter_user) {
        delete collection.filter_user;
      } else {
        collection.filter_user = filter;
      }

      collection.fetch();
    },
    onRender: function () {
      $(this.el).prepend('<option value="">Seleccionar usuario</option>');
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
    saveUser: function (e) {
      e.preventDefault();

      var form = $(this.el),
          id   = form.find('#user-id').val();

      var data = {
        name        : {
          first     : form.find('#user-firstname').val(),
          last      : form.find('#user-lastname').val(),
        },
        email       : form.find('#user-email').val(),
        role        : form.find('#user-role').val(),
        guidelines  : form.find('#user-guidelines').val(),
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
