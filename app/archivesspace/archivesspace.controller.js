'use strict';

(function() {
  angular.module('archivesSpaceController', []).controller('ArchivesSpaceController', ['$scope', 'ArchivesSpace', function($scope, ArchivesSpace) {
      $scope.options = {
        dirSelectable: true,
        equality: function(a, b) {
          if (a === undefined || b === undefined) {
            return false;
          }
          return a.id === b.id;
        },
        isLeaf: function(node) {
          return !node.has_children;
        },
      };

      $scope.on_toggle = function(node, expanded) {
        if (!expanded || !node.has_children || node.children.length > 0) {
          return;
        }

        ArchivesSpace.get(node.id).then(function(resource) {
          node.children = resource.children;
        });
      };

      ArchivesSpace.all().then(function(data) {
        $scope.data = data;
      });
    }]);
})();
