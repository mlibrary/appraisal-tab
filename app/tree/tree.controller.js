'use strict';

(function() {
  var treeController = angular.module('treeController', []);

  treeController.controller('TreeController', ['$scope', 'SelectedFiles', 'Transfer', function($scope, SelectedFiles, Transfer) {

    $scope.options = {
      closedIcon: $('<span class="fa fa-folder-o"></span>'),
      openedIcon: $('<span class="fa fa-folder-open-o"></span>'),
    };

    $scope.on_click = function(el) {
      // Disable single selection
      el.preventDefault();

      var selected_node = el.node;
      if (this.tree('isNodeSelected', selected_node)) {
        var removed = this.iterate_and_apply_event_recursively('removeFromSelection', selected_node);

        $scope.$apply(function() {
          angular.forEach(removed, function(id) {
            SelectedFiles.remove(id);
          });
        });
      } else {
        var added = this.iterate_and_apply_event_recursively('addToSelection', selected_node);

        $scope.$apply(function() {
          angular.forEach(added, function(id) {
            SelectedFiles.add(id);
          });
        });
      }
    };
    Transfer.all().then(function(data) {
      $scope.data = data.transfers;
    });
  }]);
})();
