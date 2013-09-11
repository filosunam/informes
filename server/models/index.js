'use strict';

define([
  'models/topic',
  'models/report',
  'auth'
], function (Topic, Report, auth) {

  Topic.methods(['get', 'post', 'put', 'delete']);
  Report.methods(['get', 'post', 'put', 'delete']);

  ['get', 'post', 'put', 'delete'].forEach(function (method) {
    Topic.before(method, auth);
    Report.before(method, auth);
  });

  return [Report, Topic];

});
