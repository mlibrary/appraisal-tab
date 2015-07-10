'use strict';

(function() {
  angular.module('fileService', ['restangular']).

  factory('File', ['Restangular', function(Restangular) {
    var File = Restangular.all('file');
    var FileData = Restangular.all('transferdata');
    return {
      get: function(uuid) {
        return File.one(uuid).get();
      },
      bulk_extractor_info: function(uuid) {
        return FileData.one(uuid).get();
      },
    };
  }]);
})();
