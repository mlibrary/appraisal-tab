'use strict';

(function() {
  angular.module('examineContentsController', []).

  controller('ExamineContentsController', ['$scope', 'SelectedFiles', function($scope, SelectedFiles) {
    $scope.SelectedFiles = SelectedFiles;
  }]).

  controller('ExamineContentsFileController', ['$scope', '$routeSegment', function($scope, $routeSegment) {
    $scope.id = $routeSegment.$routeParams.id;
  }]).

  controller('ExamineContentsDetailsController', ['$scope', '$routeSegment', 'File', function($scope, $routeSegment, File) {
    var id = $routeSegment.$routeParams.id;
    var type = $routeSegment.$routeParams.type;
    File.bulk_extractor_info(id).then(function(data) {
      $scope.file = data[type];
    });
  }]);
})();
