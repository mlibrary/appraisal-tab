'use strict';

(function() {
  var treeController = angular.module('treeController', []);

  treeController.controller('TreeController', ['$scope', 'SelectedFiles', 'Transfer', function($scope, SelectedFiles, Transfer) {

    $scope.options = {
      dirSelectable: true,
      multiSelection: true,
    };

    Transfer.all().then(function(data) {
      $scope.data = data.transfers;
    });
  }]);
})();
