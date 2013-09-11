'use strict';

define(['node-restful', 'db'], function (restful, db) {

  var schema = db.Schema({
    role: {
      type: String,
      default: "Waiting"
    },
    fullname: {
      firstname: String,
      lastname: String
    },
    username: String,
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    created_at: Date,
    updated_at: Date,
    lastaccess: Date
  });

  var User = restful.model('user', schema);

  User.slug = 'users';

  return User;

});
