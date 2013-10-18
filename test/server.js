'use strict';

var request = require('superagent');

// SERVER

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

// REST API

var id;

exports.Reports = {
  Post: function (test) {
    test.expect(1);

    request.post('http://localhost:3000/api/1.0/reports')
      .send({
        title: 'Carpe diem',
        type: 'Valoración',
        contents: '...'
      })
      .end(function (res) {
        
        if (res.error) {
          test.ok(false, 'Falló guardar el reporte');
        } else {
          id = res.body._id;
          test.ok(true, 'Logró guardar el reporte');
          console.log('Nuevo reporte:', res.body.title);
        }

        test.done();
      });
  },
  Get: function (test) {
    test.expect(1);

    request.get('http://localhost:3000/api/1.0/reports/' + id)
      .end(function (res) {

        if (res.error) {
          test.ok(false, 'Falló recuperar el reporte ' + id);
        } else {
          test.ok(true, 'Logró recuperar el reporte' + id);
        }

        test.done();
      });
  },
  Collection: function (test) {
    test.expect(1);

    request.get('http://localhost:3000/api/1.0/reports')
      .end(function (res) {

        if (res.error) {
          test.ok(false, 'Falló recuperar colección');
        } else {
          console.log('Número de reportes:', res.body.length);
          test.ok(true, 'Logró recuperar colección');
        }

        test.done();
      });
  },
  Update: function (test) {
    test.expect(1);

    request.put('http://localhost:3000/api/1.0/reports/' + id)
      .send({
        title: 'Hic et nunc',
        type: 'Número',
        contents: '10'
      })
      .end(function (res) {

        if (res.error) {
          test.ok(false, 'Falló actualizar el reporte');
        } else {
          test.ok(true, 'Logró actualizar el reporte');
          console.log('Actualizó reporte:', res.body.title);
        }

        test.done();
      });
  },
  Delete: function (test) {
    test.expect(1);

    request.del('http://localhost:3000/api/1.0/reports/' + id)
      .end(function (res) {
        if (res.error) {
          test.ok(false, 'Falló eliminar el reporte');
        } else {
          test.ok(true, 'Logró eliminar el reporte');
        }

        test.done();
      });
  }

};
