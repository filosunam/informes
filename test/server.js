'use strict';

var request = require('superagent');

exports.Express = {
  Running: function (test) {
    test.expect(1);
    request.get('http://localhost:3000')
            .end(function (err, res) {

              if (err) {
                test.ok(false, 'El servidor no ha iniciado');
              } else {
                test.ok(true, 'El servidor ya ha iniciado');
              }

              test.done();
            });
  }
};
