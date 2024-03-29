'use strict';

define([
  'app',
  'modules/topic',
  'modules/utility',
  'validate'
], function (app, Topic, Utility) {

  // Report Object
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
          // Send notification to destroy model
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

      // Filter by Year
      if (this.filter_year) {
        options.data = _.extend(options.data, { year: this.filter_year });
      }

      // Filter by Topic
      if (this.filter_topic) {
        options.data = _.extend(options.data, { topic: this.filter_topic });
      }

      // Filter by User
      if (this.filter_user) {
        options.data = _.extend(options.data, { user: this.filter_user });
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
    itemViewContainer: ".items",
    emptyView: Utility.Views.Loading,
    initialize: function () {
      var that = this;
      // Close empty view after synced
      this.listenTo(this.collection, 'sync', function () {
        that.closeEmptyView();
        that.emptyView = null;
      });
    }
  });

  // Report Layout
  Report.Layout = Marionette.Layout.extend({
    template: 'report/list',
    regions: {
      list: '.reports',
      pages: '.pages'
    },
    events: {
      'click .remove-list': 'removeList'
    },
    removeList: function () {
      var that    = this,
          model   = null,
          reports = this.$el.find('input:checked');

      if (reports.length > 0 && confirm('¿Estás seguro?')) {
        // Remove each model
        _.each(reports, function (report) {
          model = that.options.reports.get($(report).val());
          model.destroy();
        });
      }

    },
    onRender: function () {

      // Show list view after fetch
      this.list.show(new Report.Views.List({
        collection: this.options.reports
      }));

      // Fetch reports
      this.options.reports.fetch({
        success: function (collection) {
          if (0 === collection.size()) {
            // Redirect to add report
            app.router.navigate('#/reports/add');
          }
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
      'click .remove': 'removeReport',
      'change #report-type': 'contentElement'
    },
    regions: {
      'topics': '.select-topics'
    },
    onRender: function () {

      var that = this;

      // Fetch topics
      app.collections.topics.fetch({
        success: function (collection) {
          // Show select list view after fetch
          that.topics.show(new Topic.Views.SelectList({
            collection: collection,
            report: that.model
          }));
        }
      });

      // Validate form
      $(this.el).find('form').validate();

      // Displays type of content
      this.contentElement();

    },
    contentElement: function () {

      var value = this.$el.find('#report-type').val();

      var elements    = this.$el.find('.report-content'),
          number      = this.$el.find('.report-number'),
          valoration  = this.$el.find('.report-valuation'),
          other       = this.$el.find('.report-other'),
          element     = this.$el.find('.report-content').find('.form-control');

      // Remove rules
      element.rules('remove');

      // Remove 'name' attr
      element.removeAttr('name');

      // Hide elements by default
      elements.hide();

      // Displays content form element depending on #report-type
      switch (value) {
      case 'Número':
        number.show();
        number.find('.form-control').prop('name', 'report-content');
        number.find('.form-control').rules('add', {
          number: true
        });
        break;
      case 'Valoración':
        valoration.show();
        valoration.find('.form-control').prop('name', 'report-content');
        valoration.find('.form-control').rules('add', {
          maxlength: 10000
        });
        break;
      case 'Otro':
        other.show();
        other.find('.form-control').prop('name', 'report-content');
        other.find('.form-control').rules('add', {
          maxlength: 10000
        });
        break;
      }

    },
    removeReport: function () {
      if (confirm('¿Estás seguro?')) {
        // Destroy model
        this.model.destroy({
          success: function () {
            // Change route to #/reports
            app.router.navigate('#/reports');
          }
        });
      }
    },
    saveReport: function (e) {
      e.preventDefault();

      // Set shortcut form
      var form = $(this.el);

      // Set data object
      var data = {
        year        : form.find('#report-year').val(),
        title       : form.find('#report-title').val(),
        type        : form.find('#report-type').val(),
        topic       : form.find('#report-topic').val(),
        contents    : form.find('[name="report-content"]').val(),
        updated_at  : new Date()
      };

      console.log(data);

      // Get report id
      var id = form.find('#report-id').val();

      // Set report model (create or update)
      var report = id ? this.model : new Report.Model();

      // If is new report
      if (!id) {
        // Set user id property
        data.user = app.user.get('user')._id;
        // Set `created_at` property
        data.created_at = new Date();
      }

      // Save report model
      report.save(data, {
        success: function () {

          // Change route to #/reports
          app.router.navigate('#/reports');

          // Add saved report to collection
          app.collections.reports.add(report);

          // Then send notifications
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
