'use strict';

define(function () {

  var auth = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.send({
      errors: [{ message: "Bad Authentication data" }]
    });
  };

  return auth;

});
