'use strict';

(function() {
  angular.module('fileListController', ['fileListService']).

  controller('FileListController', ['$scope', '$routeSegment', 'FileList', 'Tag', function($scope, $routeSegment, FileList, Tag) {
    $scope.$routeSegment = $routeSegment;
    $scope.file_list = FileList;
    $scope.remove_tag = function(id, tag) {
      Tag.remove(id, tag);
    };

    $scope.$watch('file_list.files', function() {
      $scope.selected = [];
      $scope.all_selected = false;
    });

    $scope.selected = [];
    $scope.all_selected = false;

    $scope.select_all = function() {
      if (!$scope.all_selected) {
        $scope.selected = FileList.files.map(function(file) {
          return file.id;
        });
        $scope.all_selected = true;
      } else {
        $scope.selected = [];
        $scope.all_selected = false;
      }
    };

    $scope.submit = function(uuids) {
      var tag = this.tag;
      if (!tag) {
        return;
      }

      Tag.add_list(uuids, tag);
      this.tag = '';
    };

    // Sorting related
    $scope.sort_property = 'title';
    $scope.sort_reverse = false;

    $scope.set_sort_property = function(property) {
      if ($scope.sort_property === property) {
        $scope.sort_reverse = !$scope.sort_reverse;
      } else {
        $scope.sort_reverse = false;
        $scope.sort_property = property;
      }
    };

  }]);
})();
