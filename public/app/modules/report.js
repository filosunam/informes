'use strict';

define(['app'], function (app) {

  var Report = app.module();

  Report.url = app.rest + '/reports';

  Report.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: Report.url
  });

  Report.Collection = Backbone.Collection.extend({
    model: Report.Model,
    url: Report.url
  });

  Report.Views.List = Backbone.View.extend({
    template: 'report/list',
    className: 'panel panel-default panel-controls'
  });

  Report.Views.Item = Backbone.View.extend({
    template: 'report/item',
    tagName: 'tr',
    serialize: function () {
      return { model: this.model };
    }
  });

  Report.Views.Table = Backbone.View.extend({
    tagName: 'tbody',
    beforeRender: function () {
      this.$el.children().remove();
      this.options.reports.each(function (report) {
        this.insertView(new Report.Views.Item({
          model: report
        }));
      }, this);
    }
  });

  Report.Views.Form = Backbone.View.extend({
    template: 'report/edit',
    events: {
      'submit form': 'add',
      'click .remove': 'remove'
    },
    remove: function () {
      this.model.destroy({
        success: function () {
          app.router.go('list');
        }
      });
    },
    add: function (e) {
      e.preventDefault();

      var form = $(this.el),
          id   = form.find('#report-id').val();

      var data = {
        year        : form.find('#report-year').val(),
        title       : form.find('#report-title').val(),
        type        : form.find('#report-type').val(),
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
          app.router.go('list');
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
    }
  });


  return Report;

});
