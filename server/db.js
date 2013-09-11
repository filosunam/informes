'use strict';

define(['config', 'node-restful'], function (config, restful) {

  restful.mongoose.connect("mongodb://" + config.mongo.user + ':' + config.mongo.pass + '@' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db);
  return restful.mongoose;

});
