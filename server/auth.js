'use strict';

define(function () {

  var auth = function (req, res, next) {
    if (req.isAuthenticated()) {
      req.quer.where('user').equals(req.user._id);
      next();
    } else {
      res.send({
        errors: [{ message: "Bad Authentication data" }]
      });
    }
  };

  return auth;

});
