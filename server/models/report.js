'use strict';

define(['node-restful', 'db'], function (restful, db) {

  var schema = db.Schema({
    year: Number,
    title: String,
    type: String,
    contents: String,
    created_at: Date,
    updated_at: Date,
    topic: {
      ref: 'Topic',
      type: db.Schema.ObjectId
    },
    user: {
      ref: 'User',
      type: db.Schema.ObjectId
    }
  });

  var Report = restful.model('report', schema);

  Report.slug = 'reports';

  return Report;

});
