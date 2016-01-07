import angular from 'angular';
import 'restangular';

(function() {
  angular.module('fileService', ['restangular']).

  factory('File', ['Restangular', function(Restangular) {
    var File = Restangular.one('file');
    return {
      get: function(uuid) {
        return File.one(uuid).get();
      },
      bulk_extractor_info: function(uuid, reports) {
        reports = reports || [];
        reports = reports.join(',');
        return File.one(uuid).one('bulk_extractor').get({reports: reports});
      },
    };
  }]);
})();
