'use strict';

requirejs.config({
  baseUrl: 'app/',
  paths: {
    jquery: '../components/jquery/jquery.min',
    bootstrap: '../components/bootstrap/dist/js/bootstrap.min',
    underscore: '../components/underscore/underscore-min',
    backbone: '../components/backbone/backbone-min',
    layoutmanager: '../components/layoutmanager/backbone.layoutmanager',
  },
  shim: {
    "*": ['backbone'],
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    layoutmanager: {
      deps: ["backbone"],
      exports: 'Backbone.Layout'
    },
    bootstrap: {
      deps: ['jquery']
    },
    app: {
      deps: ['bootstrap']
    }
  }
});

require(['app', 'router'], function (app, Router) {
  
  // Cross Domain
  app.csrf = $("meta[name='csrf-token']").attr("content");
  Backbone.sync = (function (original) {
    return function (method, model, options) {
      options.beforeSend = function (xhr) {
        xhr.setRequestHeader('X-CSRF-Token', app.csrf);
      };
      original(method, model, options);
    };
  })(Backbone.sync);

  // Router
  app.router = new Router();
  Backbone.history.start({ pushState: false, root: app.root });

  $(document).on("click", "a[href]:not([data-bypass])", function (e) {

    // Get the absolute anchor href.
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
    // Get the absolute root.
    var root = location.protocol + "//" + location.host + app.root;

    // Ensure the root is part of the anchor href, meaning it's relative.
    if (href.prop.slice(0, root.length) === root) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      e.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.  The fragment is sliced from the root.
      Backbone.history.navigate(href.attr, true);
    }
  });

});
