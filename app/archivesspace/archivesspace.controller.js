'use strict';

(function() {
  angular.module('archivesSpaceController', []).controller('ArchivesSpaceController', ['$scope', 'ArchivesSpace', function($scope, ArchivesSpace) {
      $scope.options = {
        dirSelectable: true,
      };

      ArchivesSpace.all().then(function(data) {
        $scope.data = data;
      });
    }]);
})();
