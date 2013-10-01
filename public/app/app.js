'use strict';

define([
  'layoutmanager'
], function (LayoutManager) {


  // app object
  var app = {
    el: '#main',
    rest: 'api/1.0',
    root: '/'
  };

  // Cache the templates
  var JST = window.JST = window.JST || {};

  // Configure Layout Handler
  Backbone.Layout.configure({
    manage: true,
    prefix: 'app/templates/',
    fetchTemplate: function (path) {

      // If cached
      if (JST[path]) {
        return JST[path];
      }

      // Async mode
      var done = this.async();

      $.get(app.root + path + '.html', function (contents) {
        done(JST[path] = _.template(contents));
      });

    }
  });
  
  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {
    // Create a custom object with a nested Views object
    module: function (additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Helper for using layouts.
    useLayout: function (name, options) {
      // Enable variable arity by allowing the first argument to be the options
      // object and omitting the name argument.
      if (_.isObject(name)) {
        options = name;
      }

      // Ensure options is an object.
      options = options || {};

      // If a name property was specified use that as the template.
      if (_.isString(name)) {
        options.template = name;
      }

      // Create a new Layout with options.
      this.layout = new LayoutManager(_.extend({
        el: app.el || 'body'
      }, options));

      // Cache the refererence.
      return this.layout;
    }
  }, Backbone.Events);

});
