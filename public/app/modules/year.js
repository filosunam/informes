'use strict';

define(['app'], function (app) {

  var Year = {
    url: app.rest + '/reports',
    Views: {}
  };

  // Year Model
  Year.Model = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: Year.url
  });

  // Year Collection
  Year.Collection = Backbone.Collection.extend({
    model: Year.Model,
    url: Year.url,
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
    parse: function (results) {
      var years = [];

      _.each(results, function (report) {
        years.push({ year: report.year, user: report.user });
      });
      
      return _.uniq(years, function (y) {
        return y.year;
      });
    }
  });

  // Year Item
  Year.Views.Item = Marionette.ItemView.extend({
    tagName: 'li',
    template: 'report/year',
    events: {
      'click': 'filterByYear'
    },
    filterByYear: function (e) {
      e.preventDefault();

      var year    = this.model.get('year'),
          reports = app.collections.reports;

      $(this.el).parent().find('.active').removeClass('active');

      if (year === reports.filter_year) {
        $(this.el).removeClass('active');
        delete reports.filter_year;
      } else {
        $(this.el).addClass('active');
        reports.filter_year = year;
      }

      reports.fetch();
    },
    onRender: function () {
      if (this.model.get('year') === app.collections.reports.filter_year) {
        $(this.el).addClass('active');
      }
    }
  });

  // Year List
  Year.Views.List = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'nav nav-tabs',
    itemView: Year.Views.Item
  });

  return Year;

});
