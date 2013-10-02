'use strict';

define(['app'], function (app) {

  var User = app.module();

  User.url = app.rest + '/users';

  User.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: User.url
  });

  User.Collection = Backbone.Collection.extend({
    model: User.Model,
    url: User.url
  });

  User.Views.List = Backbone.View.extend({
    template: 'user/list',
    className: 'panel panel-default panel-controls',
    beforeRender: function () {
      this.$el.children().remove();
      this.options.users.each(function (user) {
        this.setView('.users', new User.Views.Item({
          model: user
        }), true);
      }, this);
    },
    initialize: function () {
      this.listenTo(this.options.users, {
        sync: this.render
      });
    }
  });

  User.Views.Item = Backbone.View.extend({
    template: 'user/item',
    tagName: 'tr',
    serialize: function () {
      return { model: this.model }
    }
  });

  User.Views.Form = Backbone.View.extend({
    template: 'user/edit',
    events: {
      'submit form': 'saveUser'
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

      var user = id ? this.model : new User.Model();

      if (!id) {
        data.created_at = new Date();
      }

      if (form.find('#user-password').val()) {
        data.password = form.find('#user-password').val();
      }

      console.log(id, data.password);

      user.save(data, {
        success: function () {
          app.router.users.add(user);
          app.router.go('users');

          if (id) {
            app.trigger('notify', {
              message: { text: 'Se ha modificado el usuario.' }
            });
          } else {
            app.trigger('notify', {
              message: { text: 'Se ha creado el usuario.' }
            });
          }
        }
      });

      return false;
    },
    serialize: function () {
      return {
        model: this.model ? this.model.attributes : {}
      };
    }
  });

  return User;

});
