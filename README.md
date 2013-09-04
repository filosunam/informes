Informes
========

Aplicación web para la captura de informes. Desarrollada con [Node.js](http://nodejs.org), [CouchDB](http://couchdb.apache.org) (REST API) y [Backbone](http://backbonejs.org).

# Contribuir

Usar [Grunt.js](http://gruntjs.com) para realizar tareas repetitivas en entorno de desarrollo. Las tareas de Grunt.js en este repositorio:

* `grunt server:development` para iniciar el servidor en modo *development*
* `grunt server:production` para iniciar el servidor en modo *production* (para test básico)
* `grunt watch` para observar si se modifican archivos en modo development (también esta tarea se ejecuta con `grunt server:development`)
* `grunt jshint` para validar archivos de Javascript con JSHint (backend y frontend)
* `grunt jshint:backend` para validar archivos de Javascript (backend)
* `grunt jshint:frontend` para validar archivos de Javascript (frontend)
* `grunt build` para crear y formatear archivos de producción (también esta tarea se ejecuta con `grunt server:production`)

# Todo

* Añadir soporte de [Grunt.js](http://gruntjs.com)
* Añadir REST API en CouchDB ([@puerco](https://github.com/puerco))
