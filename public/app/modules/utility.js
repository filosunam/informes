'use strict';

define(['app'], function (app) {

  // Utility Object
  var Utility = {
    Views: {}
  };

  // Loading View
  Utility.Views.Loading = Marionette.ItemView.extend({
    template: 'partials/loading'
  });

  // Pagination
  Utility.Views.Pagination = Marionette.ItemView.extend({
    template: 'partials/pagination',
    events: {
      'click .prev': 'gotoPrev',
      'click .next': 'gotoNext',
      'click .page': 'gotoPage'
    },
    gotoPrev: function (e) {
      e.preventDefault();

      // Go to previous page
      this.collection.getPreviousPage();

      // Re-render pagination controls
      this.render();
    },
    gotoPage: function (e) {
      e.preventDefault();

      // Get page number
      var page = $(e.target).text() - 1;

      // Get current page number
      var current = this.collection.state.currentPage;

      if (page !== current) {

        // Go to page
        this.collection.getPage(page);

        // Re-render pagination controls
        this.render();

      }
    },
    gotoNext: function (e) {
      e.preventDefault();

      // Go to next page
      this.collection.getNextPage();

      // Re-render pagination controls
      this.render();
    },
    serializeData: function () {
      // Send information to view
      return this.collection.state;
    },
    initialize: function () {

      // Re-render if collection trigger `reset` event
      this.listenTo(this.collection, 'reset', this.render);

    }
  });

  return Utility;

});
