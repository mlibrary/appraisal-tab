'use strict';

(function() {
  angular.module('previewController', ['route-segment']).

  controller('PreviewController', ['$scope', '$routeSegment', 'SelectedFiles', function($scope, $routeSegment, SelectedFiles) {
    $scope.id = $routeSegment.$routeParams.id;
    if ($scope.id !== undefined) {
      var file = SelectedFiles.get($scope.id);
      if (file) {
        $scope.url = '/fixtures/content/' + file.title;
        console.log($scope.url);
      }
    }
    $scope.files = SelectedFiles;
  }]);
})();
