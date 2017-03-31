require('../../vendor/angular/angular');
require('./modules/d3');
require('./modules/directives');

angular.module('AngularJS-D3App',['d3','AngularJS-D3App.directives'])
  .run(function ($rootScope) {

  });
