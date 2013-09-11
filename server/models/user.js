'use strict';

define(['node-restful', 'db'], function (restful, db) {

  var schema = db.Schema({
    role: {
      type: String,
      required: true,
      default: "Waiting"
    },
    name: {
      first: String,
      last: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    created_at: Date,
    updated_at: Date,
    lastaccess: Date,
    reports: [{
      ref: 'Report',
      type: db.Schema.ObjectId
    }]
  });

  var User = restful.model('user', schema);

  User.slug = 'users';

  return User;

});
