'use strict';

(function() {
  angular.module('previewController', ['route-segment', 'fileListService']).

  controller('PreviewController', ['$scope', '$routeSegment', 'FileList', function($scope, $routeSegment, FileList) {
    $scope.$routeSegment = $routeSegment;
    $scope.id = $routeSegment.$routeParams.id;
    if ($scope.id !== undefined) {
      var file = FileList.get($scope.id);
      if (file) {
        $scope.file = file;
        $scope.url = 'fixtures/content/' + file.title;
      }
    }
  }]);
})();
