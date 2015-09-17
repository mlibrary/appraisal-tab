'use strict';

(function() {
  angular.module('archivesSpaceController', ['alertService', 'transferService', 'ui.bootstrap']).

  controller('ArchivesSpaceController', ['$scope', '$modal', 'Alert', 'ArchivesSpace', 'Transfer', function($scope, $modal, Alert, ArchivesSpace, Transfer) {
      var levels_of_description = ArchivesSpace.get_levels_of_description().$object;

      $scope.edit = function(node) {
        var form = $modal.open({
          templateUrl: 'archivesspace/form.html',
          controller: 'ArchivesSpaceEditController',
          controllerAs: 'form',
          resolve: {
            levels: function() {
              return levels_of_description;
            },
            title: function() {
              return node.title;
            },
            level: function() {
              return node.levelOfDescription;
            },
          },
        });
        form.result.then(function(result) {
          // Assign these to variables so we can restore them if the PUT fails
          var original_title = node.title;
          var original_level = node.levelOfDescription;

          node.title = result.title;
          node.levelOfDescription = result.level;
          // Any node with pending requests will be marked as non-editable
          node.request_pending = true;

          var on_success = function(response) {
            node.request_pending = false;
          };

          var on_failure = function(error) {
            // Restore the original title/level since the request failed
            node.title = original_title;
            node.levelOfDescription = original_level;
            node.request_pending = false;

            var title = node.title;
            if (node.identifier) {
              title = title + ' (' + node.identifier + ')';
            }

            Alert.alerts.push({
              type: 'danger',
              message: 'Unable to submit edits to record "' + title + '"; check dashboard logs.',
            });
          };

          ArchivesSpace.edit(node.id, node).then(on_success, on_failure);
        });
      };

      $scope.add_child = function(node) {
        var form = $modal.open({
          templateUrl: 'archivesspace/form.html',
          controller: 'ArchivesSpaceEditController',
          controllerAs: 'form',
          resolve: {
            levels: function() {
              return ArchivesSpace.get_levels_of_description().$object;
            },
            title: function() {
              return '';
            },
            level: function() {
              return '';
            },
          },
        });
        form.result.then(function(result) {
          result.levelOfDescription = result.level;

          var on_success = function(response) {
            result.id = response.id;
            node.children.append(result);
          };

          var on_failure = function(error) {
            Alert.alerts.append({
              type: 'danger',
              message: 'Unable to add new child record to record ' + node.id,
            });
          };

          ArchivesSpace.add_child(node.id, result).then(on_success, on_failure);
        });
      };

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

        var on_failure = function(error) {
          Alert.alerts.push({
            type: 'danger',
            message: 'Unable to fetch record ' + node.id + ' from ArchivesSpace!',
          });
          console.log(Alert);
        };

        ArchivesSpace.get_children(node.id).then(function(children) {
          node.children = node.children.concat(children);
          node.children_fetched = true;
        }, on_failure);
      };

      // TODO: handle failure to contact ArchivesSpace here;
      //       probably want to scope this to only happen if ASpace pane is opened.
      //       (The controller is always instantiated before the pane opens,
      //       so adding an alert here would always render even if ArchivesSpace
      //       wasn't clicked.)
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

      // Filter the list of dragged files to contain only files with the "display"
      // parameter, so that only visibly selected files are dragged over
      var filter_files = function(file) {
        if (!file.display) {
          return {};
        }

        // Filter children recursively
        if (file.children) {
          var children = file.children;
          file.children = [];
          angular.forEach(children, function(child) {
            child = filter_files(child);
            // Omit empty objects, or directories whose children have all been filtered out
            if (child.id && child.type === 'file' || (child.children && child.children.length > 0)) {
              file.children.push(child);
            }
          });
        }

        return file;
      };

      $scope.drop = function(unused, ui) {
        var self = this;

        var file_uuid = ui.draggable.attr('uuid');
        var file = Transfer.id_map[file_uuid];
        if (dragged_ids.indexOf(file_uuid) !== -1) {
          alert("File \"" + file.title + "\" already added.");
          return;
        }

        // create a deep copy of the file and its children so we don't mutate
        // the copies used in the backlog
        file = filter_files(_.extend({}, file));
        if (!file.id) {
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
    }]).

  controller('ArchivesSpaceEditController', ['$modalInstance', 'levels', 'level', 'title', function($modalInstance, levels, level, title) {
    var vm = this;

    vm.levels = levels;
    vm.level = level;
    vm.title = title;

    vm.ok = function() {
      $modalInstance.close(vm);
    };
    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }]);
})();
