'use strict';

import angular from 'angular';

(function() {
  angular.module('previewController', ['route-segment', 'fileListService']).

  controller('PreviewController', ['$scope', '$routeSegment', 'Alert', 'File', 'FileList', function($scope, $routeSegment, Alert, File, FileList) {
    var vm = this;

    vm.set_file_data = function(file) {
      $scope.file = file;
      $scope.url = '/filesystem/' + file.id + '/download';
    };

    $scope.$routeSegment = $routeSegment;
    $scope.id = $routeSegment.$routeParams.id;
    if ($scope.id !== undefined) {
      // Try to get file from the file list first, to avoid pinging the server.
      var file = FileList.get($scope.id);
      if (file) {
        vm.set_file_data(file);
      } else {
        // If the data isn't available, contact the server to fetch file info;
        // it may not have been loaded.
        var on_failure = function(error) {
          Alert.alerts.push({
            type: 'danger',
            message: 'Unable to retrieve metadata for file with UUID ' + $scope.id,
          });
        };
        File.get($scope.id).then(function (file) {
          vm.set_file_data(file);
        }, on_failure);
      }
    }
  }]);
})();
