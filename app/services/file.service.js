'use strict';

(function() {
  var fileService = angular.module('fileService', ['restangular']);

  fileService.factory('File', ['Restangular', function(Restangular) {
    return Restangular.all('file');
  }]);
})();
