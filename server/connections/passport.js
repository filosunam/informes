'use strict';

define(['passport'], function (passport) {
  
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    done(null, id);
  });

  return passport;

});
