'use strict';

define(['app'], function (app) {

  var Topic = app.module();

  Topic.url = app.rest + '/topics';

  Topic.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: Topic.url
  });

  Topic.Collection = Backbone.Collection.extend({
    model: Topic.Model,
    url: Topic.url
  });

  Topic.Views.Item = Backbone.View.extend({
    template: 'topic/item',
    tagName: 'li',
    serialize: function () {
      return { topic: this.model };
    }
  });

  Topic.Views.List = Backbone.View.extend({
    tagName: 'ul',
    className: 'nav nav-pills nav-stacked',
    child: Topic.Views.Item,
    beforeRender: function () {
      var childView = this.child;

      this.$el.children().remove();

      this.options.topics.each(function (topic) {
        this.insertView(new childView({
          model: topic
        }));
      }, this);

      this.insertView(new Topic.Views.Form);
    }
  });

  Topic.Views.AdminItem = Topic.Views.Item.extend({
    template: 'topic/edit',
    events: {
      'click .remove': 'remove',
      'keyup input': 'update'
    },
    update: function (e) {
      this.model.set({
        title: $(e.currentTarget).val()
      });
      this.model.save();
    },
    remove: function () {
      this.model.destroy({
        success: function () {
          app.router.go('admin', 'topics');
        }
      });
    }
  });

  Topic.Views.AdminList = Topic.Views.List.extend({
    isAdmin: true,
    child: Topic.Views.AdminItem
  });

  Topic.Views.Form = Backbone.View.extend({
    template: 'topic/form',
    events: {
      'submit form': 'add'
    },
    add: function (e) {
      e.preventDefault();

      var topic = new Topic.Model();

      var data = {
        title: $(this.el).find('#title').val(),
        user: app.router.user.get('user')._id
      };

      topic.save(data, {
        success: function () {
          app.router.topics.fetch({
            success: function (model) {
              app.layout.getView('#topics').render();
            } 
          });
        }
      });
    }
  });

  return Topic;

});
