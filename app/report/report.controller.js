'use strict';

(function() {
  angular.module('reportController', ['selectedFilesService']).

  controller('ReportController', ['$scope', 'SelectedFiles', function($scope, SelectedFiles) {
    $scope.records = SelectedFiles;

    $scope.sort_property = 'format';
    $scope.reverse = false;
    $scope.sort_fn = function(record) {
      var sort_prop = $scope.sort_property;
      if (sort_prop === 'puid') {
        return record.puid;
      } else {
        return record.data[sort_prop];
      }
    };

    $scope.set_sort_property = function(property) {
      if ($scope.sort_property === property) {
        $scope.reverse = !$scope.reverse;
      } else {
        $scope.reverse = false;
        $scope.sort_property = property;
      }
    };
  }]);
})();
