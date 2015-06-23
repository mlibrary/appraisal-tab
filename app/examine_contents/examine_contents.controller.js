'use strict';

(function() {
  angular.module('examineContentsController', []).controller('ExamineContentsController', ['$scope', 'SelectedFiles', function($scope, SelectedFiles) {
    $scope.SelectedFiles = SelectedFiles;
  }]);
})();
