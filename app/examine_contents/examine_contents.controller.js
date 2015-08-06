'use strict';

(function() {
  angular.module('examineContentsController', []).

  controller('ExamineContentsController', ['$scope', '$routeSegment', 'FileList', 'SelectedFiles', 'Tag', function($scope, $routeSegment, FileList, SelectedFiles, Tag) {
    $scope.$routeSegment = $routeSegment;
    $scope.type = $routeSegment.$routeParams.type;
    $scope.SelectedFiles = SelectedFiles;

    $scope.selected = [];
    $scope.all_selected = false;

    $scope.select_all = function(files) {
      if (!$scope.all_selected) {
        $scope.selected = files.map(function(file) {
          return file.id;
        });
        $scope.all_selected = true;
      } else {
        $scope.selected = [];
        $scope.all_selected = false;
      }
    };

    $scope.submit = function(ids) {
      var tag = this.tag;
      if (!tag) {
        return;
      }

      Tag.add_list(ids, tag);
      this.tag = '';
    };

    $scope.add_to_file_list = function(ids) {
      FileList.files = SelectedFiles.selected.filter(function(file) {
        return ids.indexOf(file.id) > -1;
      });
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
