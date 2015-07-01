'use strict';

(function() {
  angular.module('examineContentsController', []).

  controller('ExamineContentsController', ['$scope', 'SelectedFiles', function($scope, SelectedFiles) {
    $scope.SelectedFiles = SelectedFiles;
  }]).

  controller('ExamineContentsFileController', ['$scope', '$routeSegment', 'File', function($scope, $routeSegment, File) {
    $scope.id = $routeSegment.$routeParams.id;
    $scope.type = $routeSegment.$routeParams.type;
    File.bulk_extractor_info($scope.id).then(function(data) {
      $scope.file = data;
    });
  }]);
})();
