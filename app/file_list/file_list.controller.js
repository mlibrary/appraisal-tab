'use strict';

(function() {
  angular.module('fileListController', ['fileListService']).

  controller('FileListController', ['$scope', 'FileList', function($scope, FileList) {
    $scope.file_list = FileList;
  }]);
})();
