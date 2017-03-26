angular.module('d3',[])

  .factory('d3Factory',['$document','$rootScope','$window','$q',
    function ($document,$rootScope,$window,$q) {
      const scriptTag = $document[0].createElement('script');

      scriptTag.async = true;
      scriptTag.type = 'text/javascript';
      scriptTag.src = '../vendor/d3/d3.js';

      scriptTag.onload = function () {
        console.log('ok!')
      };

      $document[0].body.appendChild(scriptTag);
      return $q(function(resolve,reject){
        scriptTag.onload = function () {
          $rootScope.$apply();
          if($window.d3){
            resolve($window.d3);
          } else {
            reject('Error!');
          }
        };
      });
  }]);
