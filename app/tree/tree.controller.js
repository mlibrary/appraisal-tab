'use strict';

(function() {
  var treeController = angular.module('treeController', []);

  treeController.controller('TreeController', ['$scope', 'Transfer', function($scope, Transfer) {
    Transfer.all().then(function(data) {
      $scope.data = data.transfers;
    });
  }]);
})();
