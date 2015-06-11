'use strict';

(function() {
  angular.module('archivesSpaceService', ['restangular']).factory('ArchivesSpace', ['Restangular', function(Restangular) {
      var ArchivesSpace = Restangular.all('archivesspace.json');
      return {
        all: function() {
          return ArchivesSpace.customGET();
        },
      };
  }]);
})();
