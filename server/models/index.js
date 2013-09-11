'use strict';

define([
  'models/user',
  'models/report',
  'auth'
], function (User, Report, auth) {

  User.methods(['get', 'post', 'put', 'delete']);
  Report.methods(['get', 'post', 'put', 'delete']);

  return [User, Report];

});