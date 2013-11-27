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
      // Order alphabetically
      return model.get('title');
    }
  });

  // Loading View
  Topic.Views.Loading = Marionette.ItemView.extend({
    template: 'partials/loading'
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
    itemView: Topic.Views.Item,
    emptyView: Topic.Views.Loading,
    initialize: function () {
      var that = this;
      // Close empty view after synced
      this.listenTo(this.collection, 'sync', function () {
        that.closeEmptyView();
        that.emptyView = null;
      });
    }
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
        // Send notifation if is changed
        change: function () {
          app.trigger('notify', {
            message: { text: 'Se ha modificado el tema.' }
          });
        },
        // Send notification if is removed
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

      var that = this;

      // Clear timer
      if (this.timer) {
        clearTimeout(this.timer);
      }

      // Set timer
      this.timer = setTimeout(function () {

        // Set properties
        that.model.set({
          title: $(e.currentTarget).val()
        });

        // Save topic model
        that.model.save();

        // Reset timer
        that.timer = null;

      }, 500);
    },
    removeTopic: function () {
      // Destroy model
      this.model.destroy();
    }
  });

  // Topic Admin List
  Topic.Views.AdminList = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'nav nav-pills nav-stacked',
    itemView: Topic.Views.AdminItem,
    emptyView: Topic.Views.Loading,
    initialize: function () {
      var that = this;
      // Close empty view after synced
      this.listenTo(this.collection, 'sync', function () {
        that.closeEmptyView();
        that.emptyView = null;
      });
    }
  });

  // Topic Select Item
  Topic.Views.SelectItem = Marionette.ItemView.extend({
    tagName: 'option',
    template: 'topic/select-item',
    onRender: function () {
      // Set `id` property of item
      $(this.el).prop('value', this.model.get('_id'));

      // If current model is equal to item... change `selected` to true
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
      // Serialize report model
      return {
        report: this.options.report
      };
    },
    onRender: function () {
      // Set `id` property of select element
      $(this.el).prop('id', 'report-topic');

      // Add default option of select element
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
      // Set topic model
      var topic = new Topic.Model();

      // Get value of title field
      var field = $(this.el).find('#title');

      // Set data object
      var data = {
        title       : field.val(),
        user        : app.user.get('user')._id,
        created_at  : new Date(),
        updated_at  : new Date()
      };
      
      // Save topic model
      topic.save(data, {
        success: function () {

          // Reset title field
          field.val('');

          // Add topic to collection
          app.collections.topics.add(topic);
          
          // Then notify
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
      // List admin topics
      this.topics(Topic.Views.AdminList);
      return false;
    },
    listTopics: function () {
      // List topics
      this.topics(Topic.Views.List);
      return false;
    },
    onRender: function () {
      // List topics
      this.topics(Topic.Views.List);
      // Show form
      this.form.show(new Topic.Views.Form());
    },
    topics: function (CollectionView) {
      var that = this;
      // List admin topics
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
