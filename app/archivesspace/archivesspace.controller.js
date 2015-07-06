'use strict';

(function() {
  angular.module('archivesSpaceController', []).controller('ArchivesSpaceController', ['$scope', 'ArchivesSpace', function($scope, ArchivesSpace) {
      $scope.options = {
        dirSelectable: true,
        equality: function(a, b) {
          if (a === undefined || b === undefined) {
            return false;
          }
          return a.id === b.id;
        },
      };

      ArchivesSpace.all().then(function(data) {
        $scope.data = data;
      });
    }]);
})();
