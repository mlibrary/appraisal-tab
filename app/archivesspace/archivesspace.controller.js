'use strict';

(function() {
  angular.module('archivesSpaceController', ['alertService', 'sipArrangeService', 'transferService', 'ui.bootstrap']).

  controller('ArchivesSpaceController', ['$scope', '$uibModal', 'Alert', 'ArchivesSpace', 'SipArrange', 'Transfer', function($scope, $uibModal, Alert, ArchivesSpace, SipArrange, Transfer) {
    // Reformats several properties on the form object, returning them in
    // a format suitable for use with the ArchivesSpace service's `edit`
    // and `add_child` functions.
    // Returns a modified copy of the passed-in object.
    var reformat_form_results = function(form) {
      var copy = _.extend({}, form);

      copy.levelOfDescription = form.level;
      copy.notes = [{
        type: 'odd',
        content: form.note,
      }];
      delete copy.note;

      if (form.start_date) {
        copy.dates = form.start_date.toISOString().slice(0, 10) + '-' + form.end_date.toISOString().slice(0, 10);
      }

      return copy;
    };

    var levels_of_description = ArchivesSpace.get_levels_of_description().$object;
      $scope.edit = function(node) {
        var form = $uibModal.open({
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
            start_date: function() {
              return false;
            },
            end_date: function() {
              return false;
            },
            date_expression: function() {
              return false;
            },
            note: function() {
              if (node.notes && node.notes[0]) {
                return node.notes[0].content;
              }
            },
          },
        });
        form.result.then(function(result) {
          // Assign these to variables so we can restore them if the PUT fails
          var original_title = node.title;
          var original_level = node.levelOfDescription;
          var original_note = node.notes;

          node.title = result.title;
          var formatted = reformat_form_results(result);
          node.levelOfDescription = formatted.levelOfDescription;
          node.notes = formatted.notes;
          node.dates = formatted.dates;
          // Any node with pending requests will be marked as non-editable
          node.request_pending = true;

          var on_success = function(response) {
            node.request_pending = false;
          };

          var on_failure = function(error) {
            // Restore the original title/level since the request failed
            node.title = original_title;
            node.levelOfDescription = original_level;
            node.notes = original_note;
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
        var form = $uibModal.open({
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
            start_date: function() {
              return new Date();
            },
            end_date: function() {
              return new Date();
            },
            date_expression: function() {
              return '';
            },
            note: function() {
              return '';
            },
          },
        });
        form.result.then(function(result) {
          var result = reformat_form_results(result);

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
            Alert.alerts.push({
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

      $scope.refresh = function(node) {
        if (node) {
          load_element_children(node);
        } else {
          load_data();
        }
      };

      $scope.on_toggle = function(node, expanded) {
        if (!expanded || !node.has_children || node.children_fetched) {
          return;
        }

        load_element_children(node);
      };

      var load_data = function() {
        // TODO: handle failure to contact ArchivesSpace here;
        //       probably want to scope this to only happen if ASpace pane is opened.
        //       (The controller is always instantiated before the pane opens,
        //       so adding an alert here would always render even if ArchivesSpace
        //       wasn't clicked.)
        $scope.loading = true;
        ArchivesSpace.all().then(function(data) {
          $scope.data = data;
          $scope.loading = false;
        });
      };
      load_data();

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

        var type = ui.draggable.attr('file-type');
        var is_arrange_file = !this.id;
        if (type === 'arrange') {
          var path = ui.draggable.attr('file-path');
          if (is_arrange_file) {
            return copy_arrange_to_arrange.apply(this, [path]);
          } else {
            return copy_arrange_to_aspace.apply(this, [path]);
          }
        } else {
          var file = Transfer.id_map[ui.draggable.attr('uuid')];
          if (is_arrange_file) {
            return copy_backlog_to_arrange.apply(this, [file]);
          } else {
            return copy_backlog_to_aspace.apply(this, [file]);
          }
        }
      };

      var copy_arrange_to_arrange = function(path) {
        var self = this;

        var on_move = function() {
          load_element_children(self);
        };

        SipArrange.move(path, '/arrange/' + this.path).then(on_move);
      };

      var copy_arrange_to_aspace = function(path) {
        var self = this;

        var on_move = function() {
          load_element_children(self);
        };

        ArchivesSpace.move(path, this.id).then(on_move);
      };

      var copy_backlog_to_aspace = function(file) {
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
          self.has_children = true;
          self.children = [];
          self.children_fetched = false;
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

      var copy_backlog_to_arrange = function(file) {
        var self = this;

        var source_path;
        if (file.type === 'file') {
          source_path = file.relative_path;
        } else {
          source_path = file.relative_path + '/';
        }

        // Reload the directory to reflect new contents
        var on_copy = function() {
          load_element_children(self);
        };

        $scope.$apply(function() {
          SipArrange.copy_to_arrange('/arrange/' + source_path, '/arrange/' + self.path).then(on_copy);
        });
      };

      $scope.remove = function(node) {
        if ($scope.loading) {
          return;
        }

        var on_delete = function(element) {
          // `node.parent` is undefined if this is a root-level directory
          var siblings = node.parent ? node.parent.children : $scope.data.children;
          var idx = siblings.indexOf(node);
          if (idx !== -1){
            siblings.splice(idx, 1);
          }
          $scope.selected = undefined;
        };

        // TODO is this a reliable way to tell nodes apart?
        if (node.id) { // ArchivesSpace node
          ArchivesSpace.remove(node.id).then(on_delete);
        } else {  // SipArrange node
          SipArrange.remove(node.path).then(on_delete);
        }
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

  controller('ArchivesSpaceEditController', ['$uibModalInstance', 'levels', 'level', 'title', 'start_date', 'end_date', 'date_expression', 'note', function($uibModalInstance, levels, level, title, start_date, end_date, date_expression, note) {
    var vm = this;

    vm.levels = levels;
    vm.level = level;
    vm.title = title;
    vm.start_date = start_date;
    vm.end_date = end_date;
    vm.date_expression = date_expression;
    vm.note = note;

    vm.ok = function() {
      $uibModalInstance.close(vm);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
    vm.open_datepicker = function(picker, $event) {
      var prop = picker + '_date_opened';
      this.status[prop] = true;
    };
    vm.status = {
      start_date_opened: false,
      end_date_opened: false,
    };
  }]);
})();
