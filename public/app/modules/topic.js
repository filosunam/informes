'use strict';

define(['app'], function (app) {

  var Topic = app.module();

  Topic.Model = Backbone.Model.extend();

  Topic.Model.url = 'api/1.0/topics';

  Topic.Collection = Backbone.Collection.extend({
    model: Topic.Model,
    url: Topic.Model.url
  });

  Topic.Views.Item = Backbone.View.extend({
    template: 'topic/item',
    tagName: 'li',
    serialize: function () {
      return { model: this.model };
    }
  });

  Topic.Views.List = Backbone.View.extend({
    tagName: 'ul',
    className: 'nav nav-pills nav-stacked',
    beforeRender: function () {
      this.$el.children().remove();
      this.options.topics.each(function (topic) {
        this.insertView(new Topic.Views.Item({
          model: topic
        }));
      }, this);
    }
  });

  return Topic;

});
