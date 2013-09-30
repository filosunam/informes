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

  Topic.Views.List = Backbone.View.extend({
    template: 'topic/list',
    className: 'panel panel-default panel-controls',
    events: {
      'click .admin': 'admin',
      'click .list': 'list'
    },
    controls: false,
    beforeRender: function () {
      this.$el.children().remove();
      this.setView('.form', new Topic.Views.Form);

      if (this.controls) {
        this.getAdmin();
      } else {
        this.getList();
      }

    },
    list: function () {
      this.controls = false;
      this.render();

      return false;
    },
    admin: function () {
      this.controls = true;
      this.render();

      return false;
    },
    getList: function () {

      this.options.topics.each(function (topic) {
        this.insertView('#topic-list', new Topic.Views.Item({
          model: topic
        }));
      }, this);

    },
    getAdmin: function () {

      this.options.topics.each(function (topic) {
        this.insertView('#topic-list', new Topic.Views.AdminItem({
          model: topic
        }));
      }, this);

    },
    initialize: function () {
      var self = this;
      this.listenTo(this.options.topics, {
        sync: function (model, resp, options) {
          if(!options.validate || options.xhr.status === 201) {
            this.render();
          }
        }
      });
    }
  });

  Topic.Views.Item = Backbone.View.extend({
    template: 'topic/item',
    tagName: 'li',
    serialize: function () {
      return { topic: this.model };
    },
    initialize: function () {
      this.listenTo(this.model, {
        remove: this.remove
      });
    }
  });

  Topic.Views.AdminItem = Topic.Views.Item.extend({
    template: 'topic/edit',
    events: {
      'click .remove': 'removeTopic',
      'keyup input': 'updateTopic'
    },
    updateTopic: function (e) {
      this.model.set({
        title: $(e.currentTarget).val()
      });
      this.model.save();
    },
    removeTopic: function () {
      this.model.destroy();
    }
  });

  Topic.Views.SelectItem = Backbone.View.extend({
    template: _.template("<%= topic.title %>"),
    tagName: 'option',
    beforeRender: function () {

      this.$el.attr('value', this.model._id);

      this.report = this.options.report;

      if (this.report && this.report.get('topic') === this.model._id) {
        this.$el.attr('selected', true);
      }
    },
    serialize: function() {
      return { topic: this.model };
    }
  });

  Topic.Views.Form = Backbone.View.extend({
    template: 'topic/form',
    events: {
      'submit form': 'add'
    },
    add: function (e) {
      var topic = new Topic.Model();

      var data = {
        title: $(this.el).find('#title').val(),
        user: app.router.user.get('user')._id
      };

      topic.save(data, {
        success: function () {
          app.router.topics.add(topic);
        }
      });

      return false;
    }
  });

  return Topic;

});
