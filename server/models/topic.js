'use strict';

define(['node-restful', 'db'], function (restful, db) {

  var schema = db.Schema({
    title: {
      type: String,
      required: true
    },
    user: {
      ref: 'User',
      type: db.Schema.ObjectId
    },
    created_at: Date,
    updated_at: Date
  });

  var Topic = restful.model('topic', schema);

  Topic.slug = 'topics';

  return Topic;

});
