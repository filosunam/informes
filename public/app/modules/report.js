'use strict';

define(['app', 'modules/topic'], function (app, Topic) {

  var Report = {
    url: app.rest + '/reports',
    Views: {}
  };

  // Report Model
  Report.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: Report.url,
    defaults: {
      _id: null,
      year: '',
      title: '',
      type: '',
      topic: null,
      contents: '',
      created_at: '',
      updated_at: ''
    },
    initialize: function () {
      this.listenTo(this, {
        destroy: function () {
          app.trigger('notify', {
            message: { text: 'Se ha eliminado el reporte.' }
          });
        }
      });
    }
  });

  // Report Collection
  Report.Collection = Backbone.Collection.extend({
    model: Report.Model,
    url: Report.url,
    fetch: function (options) {

      if (!options) {
        options = {};
      }

      if (!options.data) {
        options.data = {};
      }

      if (this.filter_year) {
        options.data = _.extend(options.data, { year: this.filter_year });
      }

      if (this.filter_topic) {
        options.data = _.extend(options.data, { topic: this.filter_topic });
      }

      return Backbone.Collection.prototype.fetch.call(this, options);

    },
    comparator: function (report) {
      return -new Date(report.get("updated_at"));
    }
  });

  // Report Item
  Report.Views.Item = Marionette.ItemView.extend({
    tagName: 'tr',
    template: 'report/item'
  });

  // Report List
  Report.Views.List = Marionette.CompositeView.extend({
    tagName: 'table',
    className: 'table table-striped table-hover',
    template: 'report/table',
    itemView: Report.Views.Item,
    itemViewContainer: ".items"
  });

  // Report Layout
  Report.Layout = Marionette.Layout.extend({
    template: 'report/list',
    className: 'panel panel-default panel-controls',
    regions: {
      list: '.reports'
    },
    events: {
      'click .remove-list': 'removeList'
    },
    removeList: function () {
      var that    = this,
          model   = null,
          reports = [];

      _.each(this.$el.find('input:checked'), function (report) {
        model = that.options.reports.get($(report).val());
        model.destroy();
      });
    },
    onRender: function () {
      var that = this;
      // list reports
      this.options.reports.fetch({
        success: function (collection) {
          that.list.show(new Report.Views.List({
            collection: collection
          }));
        }
      });
    }
  });

  // Report Details
  Report.Details = Marionette.Layout.extend({
    template: 'report/edit',
    className: 'panel panel-default panel-controls',
    events: {
      'submit form': 'saveReport',
      'click .remove': 'removeReport'
    },
    regions: {
      'topics': '.select-topics'
    },
    onRender: function () {

      var that = this;

      app.collections.topics.fetch({
        success: function (collection) {
          that.topics.show(new Topic.Views.SelectList({
            collection: collection,
            report: that.model
          }));
        }
      });

    },
    removeReport: function () {
      this.model.destroy({
        success: function () {
          app.router.navigate('#/reports');
        }
      });
    },
    saveReport: function (e) {
      e.preventDefault();

      var form = $(this.el),
          id   = form.find('#report-id').val();

      var data = {
        year        : form.find('#report-year').val(),
        title       : form.find('#report-title').val(),
        type        : form.find('#report-type').val(),
        topic       : form.find('#report-topic').val(),
        contents    : form.find('#report-content').val(),
        user        : app.user.get('user')._id,
        updated_at  : new Date()
      };

      var report = id ? this.model : new Report.Model();

      if (!id) {
        data.created_at = new Date();
      }

      report.save(data, {
        success: function () {
          app.router.navigate('#/reports');
          app.collections.reports.add(report);

          if (id) {
            app.trigger('notify', {
              message: { text: 'Se ha modificado el reporte.' }
            });
          } else {
            app.trigger('notify', {
              message: { text: 'Se ha creado el reporte.' }
            });
          }
        }
      });

    }
  });

  return Report;

});
