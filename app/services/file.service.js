'use strict';

(function() {
  var fileService = angular.module('fileService', ['restangular']);

  fileService.factory('File', ['Restangular', function(Restangular) {
    var File = Restangular.all('file');
    return {
      get: function(uuid) {
        return File.one(uuid).get();
      },
    };
  }]);
})();
