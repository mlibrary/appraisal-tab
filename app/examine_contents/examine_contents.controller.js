'use strict';

(function() {
  angular.module('examineContentsController', []).

  controller('ExamineContentsController', ['$scope', '$routeSegment', 'SelectedFiles', 'Tag', function($scope, $routeSegment, SelectedFiles, Tag) {
    $scope.$routeSegment = $routeSegment;
    $scope.type = $routeSegment.$routeParams.type;
    $scope.SelectedFiles = SelectedFiles;

    $scope.submit = function(files) {
      var tag = this.tag;
      if (!tag) {
        return;
      }

      var ids = files.map(function(file) {
        return file.id;
      });
      Tag.add_list(ids, tag);
      this.tag = '';
    };
  }]).

  controller('ExamineContentsFileController', ['$scope', '$routeSegment', 'File', function($scope, $routeSegment, File) {
    $scope.id = $routeSegment.$routeParams.id;
    $scope.type = $routeSegment.$routeParams.type;
    File.bulk_extractor_info($scope.id).then(function(data) {
      $scope.file = data;
    });
  }]);
})();
