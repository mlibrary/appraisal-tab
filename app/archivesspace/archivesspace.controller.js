'use strict';

(function() {
  angular.module('archivesSpaceController', ['transferService']).

  controller('ArchivesSpaceController', ['$scope', 'ArchivesSpace', 'Transfer', function($scope, ArchivesSpace, Transfer) {
      $scope.options = {
        dirSelectable: true,
        equality: function(a, b) {
          if (a === undefined || b === undefined) {
            return false;
          }
          return a.id === b.id;
        },
        isLeaf: function(node) {
          // TODO: add .has_children to Transfer objects, too
          if (Object.keys(node).indexOf('type') !== -1) {
            return node.type === 'file';
          } else {
            return !node.has_children;
          }
        },
      };

      $scope.on_toggle = function(node, expanded) {
        if (!expanded || !node.has_children || node.children_fetched) {
          return;
        }

        ArchivesSpace.get(node.id).then(function(resource) {
          node.children = node.children.concat(resource.children);
          node.children_fetched = true;
        });
      };

      ArchivesSpace.all().then(function(data) {
        $scope.data = data;
      });

      // Prevent a given file or its descendants from being dragged more than once
      var dragged_ids = [];
      var log_ids = function(file) {
        dragged_ids.push(file.id);
        if (file.children) {
          for (var i = 0; i < file.children.length; i++) {
            log_ids(file.children[i]);
          }
        }
      }

      $scope.drop = function(_, ui) {
        var self = this;

        var file_uuid = ui.draggable.attr('uuid');
        var file = Transfer.id_map[file_uuid]
        if (dragged_ids.indexOf(file_uuid) !== -1) {
          alert("File \"" + file.title + "\" already added.");
          return;
        }

        $scope.$apply(function() {
          // TODO: ping ArchivesSpace to upload a new record using this file
          if (!self.children) {
            self.children = [];
            self.has_children = true;
          }
          self.children = self.children.concat(file);
          log_ids(file);

          if ($scope.expanded_nodes.indexOf(self) === -1) {
            $scope.expanded_nodes.push(self);
            // expanded event will not fire if the node was programmatically expanded
            $scope.on_toggle(self, true);
          }
        });
      }
    }]);
})();
