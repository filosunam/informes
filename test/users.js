'use strict';

var request = require('superagent');

var data = {
  url: 'http://localhost:3000/session',
  email: 'markotom@gmail.com',
  password: '1234567890'
};

exports.User = {
  Login: function (test) {
    test.expect(1);
    request.post(data.url)
      .send({
        email: data.email,
        password: data.password
      })
      .end(function (res) {
        
        if (401 === res.status) {
          test.ok(false, 'Unauthorized');
        } else {
          test.ok(true, 'Logged in...');
        }

        test.done();
      });
  },
  Logout: function (test) {
    test.expect(1);

    request.del(data.url)
      .end(function (res) {
        
        if (false === res.body.auth) {
          test.ok(true, 'Logged out...');
        } else {
          test.ok(false, 'Still authorized');
        }

        test.done();
      });
  }
};
