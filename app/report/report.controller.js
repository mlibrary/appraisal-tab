'use strict';

(function() {
  var reportController = angular.module('reportController', ['selectedFilesService']);

  reportController.controller('ReportController', ['$scope', 'SelectedFiles', function($scope, SelectedFiles) {
      $scope.records = SelectedFiles;
    }]);
})();
