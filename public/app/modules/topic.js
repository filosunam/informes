'use strict';

define(['app'], function (app) {

  var Topic = {
    url: app.rest + '/topics',
    Views: {}
  };

  // Topic Model
  Topic.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: Topic.url
  });

  // Topic Collection
  Topic.Collection = Backbone.Collection.extend({
    model: Topic.Model,
    url: Topic.url,
    fetch: function (options) {

      if (!options) {
        options = {};
      }

      if (!options.data) {
        options.data = {};
      }

      // Filter by User
      if (this.filter_user) {
        options.data = _.extend(options.data, { user: this.filter_user });
      }

      return Backbone.Collection.prototype.fetch.call(this, options);

    },
    comparator: function (model) {
      return model.get('title');
    }
  });

  // Topic Item
  Topic.Views.Item = Marionette.ItemView.extend({
    tagName: 'li',
    template: 'topic/item',
    events: {
      'click a': 'filterByTopic'
    },
    filterByTopic: function () {

      var topic   = this.model.get('_id'),
          reports = app.collections.reports;

      $(this.el).parent().find('.active').removeClass('active');

      if (topic === reports.filter_topic) {
        $(this.el).removeClass('active');
        delete reports.filter_topic;
      } else {
        $(this.el).addClass('active');
        reports.filter_topic = topic;
      }

      reports.fetch();

      return false;
    },
    onRender: function () {
      if (this.model.get('_id') === app.collections.reports.filter_topic) {
        $(this.el).addClass('active');
      }
    }
  });

  // Topic List
  Topic.Views.List = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'nav nav-pills nav-stacked',
    itemView: Topic.Views.Item
  });

  // Topic Admin Item
  Topic.Views.AdminItem = Marionette.ItemView.extend({
    tagName: 'li',
    template: 'topic/edit',
    events: {
      'click .remove': 'removeTopic',
      'keyup input': 'updateTopic',
      'submit form': 'updateTopic'
    },
    initialize: function () {
      this.listenTo(this.model, {
        change: function () {
          app.trigger('notify', {
            message: { text: 'Se ha modificado el tema.' }
          });
        },
        remove: function () {
          this.remove();
          app.trigger('notify', {
            message: { text: 'Se ha eliminado el tema.' }
          });
        }
      });
    },
    updateTopic: function (e) {
      e.preventDefault();

      this.model.set({
        title: $(e.currentTarget).val()
      });
      this.model.save();
    },
    removeTopic: function () {
      this.model.destroy();
    }
  });

  // Topic Admin List
  Topic.Views.AdminList = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'nav nav-pills nav-stacked',
    itemView: Topic.Views.AdminItem
  });

  // Topic Select Item
  Topic.Views.SelectItem = Marionette.ItemView.extend({
    tagName: 'option',
    template: 'topic/select-item',
    onRender: function () {
      $(this.el).prop('value', this.model.get('_id'));

      if (this.options.report.get('topic') === this.model.get('_id')) {
        this.$el.attr('selected', true);
      }
    }
  });

  // Topic Select List
  Topic.Views.SelectList = Marionette.CollectionView.extend({
    tagName: 'select',
    className: 'form-control',
    itemView: Topic.Views.SelectItem,
    itemViewOptions: function () {
      return {
        report: this.options.report
      };
    },
    onRender: function () {
      $(this.el).prop('id', 'report-topic');
      $(this.el).prepend('<option>Seleccionar tema</option>');
    }
  });

  // Topic Form
  Topic.Views.Form = Marionette.ItemView.extend({
    template: 'topic/form',
    events: {
      'submit form': 'add'
    },
    add: function (e) {
      var topic = new Topic.Model(),
          field = $(this.el).find('#title');

      var data = {
        title: field.val(),
        user: app.user.get('user')._id
      };

      topic.save(data, {
        success: function () {

          // reset field
          field.val('');

          // add topic to collection
          app.collections.topics.add(topic);
          
          // then notify
          app.trigger('notify', {
            message: { text: 'Se ha creado el tema.' }
          });
          
        }
      });

      return false;
    }
  });

  // Topic Layout
  Topic.Layout = Marionette.Layout.extend({
    template: 'topic/list',
    className: 'panel panel-default panel-controls',
    regions: {
      form: '.form',
      list: '.topics'
    },
    events: {
      'click .admin': 'adminTopics',
      'click .list': 'listTopics'
    },
    adminTopics: function () {
      // list admin topics
      this.topics(Topic.Views.AdminList);
      return false;
    },
    listTopics: function () {
      // list topics
      this.topics(Topic.Views.List);
      return false;
    },
    onRender: function () {
      // list topics
      this.topics(Topic.Views.List);
      // show form
      this.form.show(new Topic.Views.Form());
    },
    topics: function (CollectionView) {
      var that = this;
      // list admin topics
      this.options.topics.fetch({
        success: function (collection) {
          that.list.show(new CollectionView({
            collection: collection
          }));
        }
      });
    }
  });

  return Topic;

});
