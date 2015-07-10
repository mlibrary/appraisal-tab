'use strict';

(function() {
  angular.module('archivesSpaceService', ['restangular']).

  factory('ArchivesSpace', ['Restangular', function(Restangular) {
      var ArchivesSpace = Restangular.all('archivesspace.json');
      return {
        all: function() {
          return ArchivesSpace.customGET();
        },
        get: function(id) {
          var url_fragment = id.replace(/\//g, '-');
          // TODO make this use the ArchivesSpace object above, once these
          // are both fetching from real services and not fixtures
          return Restangular.all('archivesspace').one(url_fragment).get();
        },
      };
  }]);
})();
