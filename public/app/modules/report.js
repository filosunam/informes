'use strict';

define(['app'], function (app) {

  var Report = app.module();

  Report.url = app.rest + '/reports';

  Report.Model = Backbone.Model.extend({
    url: Report.url
  });

  Report.Collection = Backbone.Collection.extend({
    model: Report.Model,
    url: Report.url,
    initialize: function () {
      this.fetch();
    }
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
    },
    initialize: function() {
      var self = this;

      this.listenTo(this.options.reports, {
        reset: function () {
          self.options.reports.fetch({
            success: function () {
              self.render();
            }
          });
        }
      });
    }
  });
      });
    }
  });

  // Years Collection

  Report.YearCollection = Backbone.Collection.extend({
    model: Report.Model,
    url: Report.url,
    initialize: function () {
      this.fetch();
    },
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
    },
    initialize: function() {
      var self = this;

      this.listenTo(this.options.years, {
        reset: function () {
          self.options.years.fetch({
            success: function () {
              self.render();
            }
          });
        }
      });
    }
  });


  return Report;

});
