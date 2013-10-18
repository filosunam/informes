'use strict';

define(['config', 'node-restful'], function (config, restful) {

  restful.mongoose.connect(config.mongo.url);
  return restful.mongoose;

});
