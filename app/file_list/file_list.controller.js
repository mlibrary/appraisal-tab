'use strict';

(function() {
  angular.module('fileListController', ['fileListService']).

  controller('FileListController', ['$scope', 'FileList', 'Tag', function($scope, FileList, Tag) {
    $scope.file_list = FileList;
    $scope.remove_file = FileList.remove.bind(FileList);
    $scope.remove_tag = function(id, tag) {
      Tag.remove(id, tag);
    };
  }]);
})();
