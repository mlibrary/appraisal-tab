'use strict';

(function() {
  angular.module('archivesSpaceController', ['alertService', 'sipArrangeService', 'transferService', 'ui.bootstrap']).

  controller('ArchivesSpaceController', ['$scope', '$modal', 'Alert', 'ArchivesSpace', 'SipArrange', 'Transfer', function($scope, $modal, Alert, ArchivesSpace, SipArrange, Transfer) {
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
            result.parent = node;
            if (!node.has_children) {
              node.has_children = true;
              node.children = [];
              node.children_fetched = false;
            }
            node.children.push(result);
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
          } else if (a.id && b.id) {
            return a.id === b.id;
          } else {
            return a.path === b.path;
          }
        },
        isLeaf: function(node) {
          return !node.has_children;
        },
      };

      // Loads the children of the specified element,
      // along with arranged SIP contents that might exist
      var load_element_children = function(node) {
        $scope.loading = true;

        var on_failure_aspace = function(error) {
          Alert.alerts.push({
            type: 'danger',
            message: 'Unable to fetch record ' + node.id + ' from ArchivesSpace!',
          });
          $scope.loading = false;
        };

        var on_failure_arrange = function(error) {
          Alert.alerts.push({
            type: 'danger',
            message: 'Unable to fetch record ' + node.path + ' from Arrangement!',
          });
          $scope.loading = false;
        };

        node.children = [];

        if (node.id) {  // ArchivesSpace node
          ArchivesSpace.get_children(node.id).then(function(children) {
            children.map(function(element) { element.parent = node; });
            node.children = node.children.concat(children);
            node.children_fetched = true;
            $scope.loading = false;
          }, on_failure_aspace);

          // Also call into SIP arrange to see if there are any contents at this
          // level of description; if so, render them like any other ASpace objects
          ArchivesSpace.list_arrange_contents(node.id, node).then(function(entries) {
            node.children = node.children.concat(entries);
          });
        } else {  // SipArrange node
          SipArrange.list_contents(node.path, node).then(function(entries) {
            node.children = entries;
            node.children_fetched = true;
            $scope.loading = false;
          }, on_failure_arrange);
        }
      };

      $scope.on_toggle = function(node, expanded) {
        if (!expanded || !node.has_children || node.children_fetched) {
          return;
        }

        load_element_children(node);
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
        if ($scope.loading) {
          return;
        }

        var file_uuid = ui.draggable.attr('uuid');
        var file = Transfer.id_map[file_uuid];
        if (dragged_ids.indexOf(file_uuid) !== -1) {
          alert('File "' + file.title + '" already added.');
          return;
        }

        if (this.id) {  // ArchivesSpace information object
          return drop_onto_aspace_record.apply(this, [file]);
        } else {  // file within arrange
          return drop_onto_arrange_directory.apply(this, [file]);
        }
      };

      var drop_onto_aspace_record = function(file) {
        var self = this;

        // create a deep copy of the file and its children so we don't mutate
        // the copies used in the backlog
        file = filter_files(_.extend({}, file));
        if (!file.id) {
          return;
        }

        var on_directory_creation = function(response) {
          // Add path to parent
          self.path = response.path;
          ArchivesSpace.copy_to_arrange(self.id, '/originals/' + source_path).then(on_copy);
        };

        var on_copy = function() {
          if ($scope.expanded_nodes.indexOf(self) === -1) {
            $scope.expanded_nodes.push(self);
            // expanded event will not fire if the node was programmatically expanded - this loads children
            $scope.on_toggle(self, true);
          } else {
            // Reload the directory to reflect new contents
            load_element_children(self);
          }
        };

        var source_path;
        if (file.type === 'file') {
          source_path = file.relative_path;
        } else {
          source_path = file.relative_path + '/';
        }

        $scope.$apply(function() {
          $scope.loading = true;

          ArchivesSpace.create_directory(self.id).then(on_directory_creation);
        });
      };

      var drop_onto_arrange_directory = function(file) {
        var self = this;

        // Reload the directory to reflect new contents
        var on_success = function(entries) {
          self.parent.children = entries;
        };

        $scope.$apply(function() {
          SipArrange.list_contents('/arrange/' + self.parent.path, self.parent.parent).then(on_success);
        });
      };

      $scope.finalize_arrangement = function(node) {
        var on_success = function() {
          Alert.alerts.push({
            type: 'success',
            message: 'Successfully started SIP from record "' + node.title + '"',
          });
        };
        var on_failure = function(error) {
          var message;
          // error.message won't be defined if this returned an HTML 500
          if (error.message && error.message.startsWith('No SIP Arrange mapping')) {
            message = 'Unable to start SIP; no files arranged into record "' + node.title + '".';
          } else {
            message = 'Unable to start SIP; check dashboard logs.';
          }
          Alert.alerts.push({
            type: 'danger',
            message: message,
          });
        };

        ArchivesSpace.start_sip(node.id).then(on_success, on_failure);
      };
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
