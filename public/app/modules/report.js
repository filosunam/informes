'use strict';

define(['app', 'modules/topic'], function (app, Topic) {

  var Report = app.module();

  Report.url = app.rest + '/reports';

  Report.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: Report.url,
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

  Report.Collection = Backbone.Collection.extend({
    model: Report.Model,
    url: Report.url,
    fetch: function (options) {

      options || (options = {});
      options.data || (options.data = {});

      if (this.filter_year) {
        options.data = _.extend(options.data, { year: this.filter_year });
      }

      if (this.filter_topic) {
        options.data = _.extend(options.data, { topic: this.filter_topic });
      }

      return Backbone.Collection.prototype.fetch.call(this, options);

    },
    comparator: function(report) {
      return -new Date(report.get("updated_at"));
    }
  });

  Report.Views.Item = Backbone.View.extend({
    template: 'report/item',
    tagName: 'tr',
    serialize: function () {
      return { model: this.model };
    },
    initialize: function () {
      this.listenTo(this.model, {
        remove: function () {
          this.remove();
          app.router.years.fetch();
        }
      });
    }
  });

  Report.Views.List = Backbone.View.extend({
    template: 'report/list',
    className: 'panel panel-default panel-controls',
    events: {
      'click .remove-list': 'removeList'
    },
    beforeRender: function () {
      this.$el.children().remove();
      this.options.reports.each(function (report) {
        this.setView('#reports', new Report.Views.Item({
          model: report
        }), true);
      }, this);
    },
    removeList: function (e) {
      var self    = this,
          model   = undefined,
          reports = [];

      _.each(this.$el.find('input:checked'), function (report) {
        model = self.options.reports.get($(report).val());
        model.destroy();
      });

    },
    initialize: function () {
      this.listenTo(this.options.reports, {
        sync: this.render,
        change: this.render
      });
    }
  });

  Report.Views.Form = Backbone.View.extend({
    template: 'report/edit',
    events: {
      'submit form': 'saveReport',
      'click .remove': 'removeReport'
    },
    beforeRender: function () {
      this.$el.children().remove();
      this.options.topics.each(function (topic) {
        this.setView('.topics', new Topic.Views.SelectItem({
          model: topic.attributes,
          report: this.model
        }), true);
      }, this);
    },
    removeReport: function () {
      this.model.destroy({
        success: function () {
          app.router.go('list');
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
        user        : app.router.user.get('user')._id,
        updated_at  : new Date()
      };

      var report = id ? this.model : new Report.Model();

      if (!id) {
        data.created_at = new Date();
      }

      report.save(data, {
        success: function () {
          app.router.reports.add(report);
          app.router.go('list');

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

    },
    serialize: function () {
      return {
        model: this.model ? this.model.attributes : {}
      };
    }
  });

  // Years Collection

  Report.YearCollection = Backbone.Collection.extend({
    model: Report.Model,
    url: Report.url,
    parse: function (results) {
      var years = [];

      _.each(results, function (report) {
        years.push({ year: report.year });
      });
      
      return _.uniq(years, function (y) {
        return y.year;
      });
    }
  });

  Report.Views.YearItem = Backbone.View.extend({
    template: 'report/year',
    tagName: 'li',
    events: {
      'click': 'filterByYear'
    },
    filterByYear: function () {

      if (this.model.get('year') === app.router.reports.filter_year) {
        $(this.el).removeClass('active');
        delete app.router.reports.filter_year;
      } else {
        app.router.reports.filter_year = this.model.get('year');
      }

      app.router.years.fetch();
      app.router.reports.fetch();
      app.router.topics.fetch();

      return false;
    },
    beforeRender: function () {
      if (this.model.get('year') === app.router.reports.filter_year) {
        $(this.el).addClass('active');
      }
    },
    serialize: function () {
      return { model: this.model };
    }
  });

  Report.Views.YearList = Backbone.View.extend({
    tagName: 'ul',
    className: 'nav nav-tabs',
    beforeRender: function () {
      this.$el.children().remove();
      this.options.years.each(function (report) {
        this.insertView(new Report.Views.YearItem({
          model: report
        }));
      }, this);
    },
    initialize: function () {
      this.listenTo(this.options.years, {
        sync: this.render
      });
    }
  });


  return Report;

});
