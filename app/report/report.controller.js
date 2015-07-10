'use strict';

(function() {
  angular.module('reportController', ['selectedFilesService']).

  controller('ReportController', ['$scope', 'SelectedFiles', function($scope, SelectedFiles) {
    $scope.records = SelectedFiles;
  }]);
})();
