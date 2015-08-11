'use strict';

(function() {
  angular.module('previewController', ['route-segment', 'fileListService']).

  controller('PreviewController', ['$scope', '$routeSegment', 'File', 'FileList', function($scope, $routeSegment, File, FileList) {
    var vm = this;

    vm.set_file_data = function(file) {
      $scope.file = file;
      $scope.url = 'fixtures/content/' + file.title;
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
        File.get($scope.id).then(function (file) {
          vm.set_file_data(file);
        });
      }
    }
  }]);
})();
