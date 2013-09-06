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


  return Report;

});
