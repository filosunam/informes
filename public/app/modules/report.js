'use strict';

define(['app'], function (app) {

  var Report = app.module();

  Report.Model = Backbone.Model.extend();

  Report.Model.url = 'api/1.0/reports';

  Report.Collection = Backbone.Collection.extend({
    model: Report.Model,
    url: Report.Model.url
  });

  Report.Views.Item = Backbone.View.extend({
    template: 'report/item',
    tagName: 'tr',
    serialize: function () {
      return { model: this.model };
    }
  });

  Report.Views.List = Backbone.View.extend({
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

  // Years Collection

  Report.YearCollection = Backbone.Collection.extend({
    model: Report.Model,
    url: Report.Model.url,
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
