'use strict';

define([
  'models/user',
  'models/topic',
  'models/report',
  'auth'
], function (User, Topic, Report, auth) {

  User.methods(['get', 'post', 'put', 'delete']);
  Topic.methods(['get', 'post', 'put', 'delete']);
  Report.methods(['get', 'post', 'put', 'delete']);

  ['get', 'post', 'put', 'delete'].forEach(function (method) {
    Topic.before(method, auth);
    Report.before(method, auth);
    User.before(method, auth);
  });

  User.before('post', User.hash_password)
      .before('put', User.hash_password);

  return [User, Report, Topic];

});
