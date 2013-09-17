'use strict';

define(['app'], function (app) {

  var Topic = app.module();

  Topic.url = app.rest + '/topics';

  Topic.Model = Backbone.Model.extend({
    url: Topic.url,
  });

  Topic.Collection = Backbone.Collection.extend({
    model: Topic.Model,
    url: Topic.url,
    initialize: function () {
      this.fetch();
    }
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
    },
    initialize: function() {
      var self = this;

      this.listenTo(this.options.topics, {
        reset: function () {
          this.options.topics.fetch({
            success: function () {
              self.render();
            }
          });
        }
      });
    }
  });
    }
  });

  return Topic;

});
