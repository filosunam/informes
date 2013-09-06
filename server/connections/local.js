'use strict';

define(['passport-local'], function (LocalStrategy) {

  var localStrategy = new LocalStrategy.Strategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function (email, password, done) {

      // just temp
      if (email === password) {
        return done(null, {
          id: 1,
          username: 'Secretaría Académica',
          email: 'academica@filos.unam.mx',
        });
      } else {
        return done(null, false);
      }

    }
  );

  return localStrategy;

});
