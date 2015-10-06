'use strict';

(function() {
  angular.module('arrangementController', ['sipArrangeService']).

  controller('ArrangementController', ['$scope', 'Alert', 'Transfer', 'SipArrange', function($scope, Alert, Transfer, SipArrange) {
    var vm = this;

    var load_data = function() {
      SipArrange.list_contents().then(function(directories) {
        vm.data = directories;
      });
    };

    vm.options = {
      dirSelectable: true,
      isLeaf: function(node) {
        return !node.has_children;
      },
    };
    vm.filter_expression = {display: true};
    vm.filter_comparator = true;

    vm.on_toggle = function(node, expanded) {
      if (!expanded || node.children_fetched) {
        return;
      }

      var path = '/arrange/' + node.path;
      SipArrange.list_contents(path, node).then(function(entries) {
        node.children = entries;
        node.children_fetched = true;
      });
    };

    vm.create_directory = function(parent) {
      var path = prompt('Name of new directory?');
      if (!path) {
        return;
      }

      if (parent === undefined) {
        var target = vm.data;
        var full_path = path;
      } else {
        var target = parent.children;
        var full_path = parent.path + '/' + path;
      }

      SipArrange.create_directory('/arrange/' + full_path, path, parent).then(function(result) {
        target.push(result);
      });
    };

    vm.delete_directory = function(element) {
      SipArrange.remove('/arrange/' + element.path).then(function(success) {
        // `element.parent` is undefined if this is a root-level directory
        var parent = element.parent ? element.parent.children : vm.data;

        var idx = parent.indexOf(element);
        parent.splice(idx, 1);
      });
    };

    var hide_elements = function(node) {
      node.display = false;
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          hide_elements(node.children[i]);
        }
      }
    };

    vm.start_sip = function(directory) {
      var on_success = function(success) {
        // Hide elements from the UI so user doesn't try to start it again
        hide_elements(directory);

        Alert.alerts.push({
          'type': 'success',
          'message': 'SIP successfully started!',
        });
      };

      var on_failure = function(error) {
        Alert.alerts.push({
          'type': 'danger',
          'message': 'SIP could not be started! Check dashboard logs.',
        });
      };

      SipArrange.start_sip('/arrange/' + directory.path + '/').then(on_success, on_failure);
    };

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

    vm.drop = function(unused, ui) {
      if (ui.draggable.attr('file-type') === 'arrange') {
        return drop_from_arrange.apply(this, [unused, ui]);
      } else {
        return drop_from_backlog.apply(this, [unused, ui]);
      }
    };

    var on_copy_failure = function(error) {
      Alert.alerts.push({
        'type': 'danger',
        'message': 'Failed to copy files to SIP arrange; check Dashboard logs.',
      });
    };
    var on_copy_success = function(success) {
      // Reload the tree, rather than recreating the structure locally,
      // since it's possible the structure of the dragged files
      // may differ from the structure of what actually entered arrange.
      // TODO: when bugs about dragging contents into the wrong directory are
      //       resolved, maybe want to reload only the directory into which
      //       contents were dragged and not the entire tree.
      load_data();
    };

    var drop_from_backlog = function(unused, ui) {
      var file_uuid = ui.draggable.attr('uuid');
      var file = Transfer.id_map[file_uuid];
      // create a deep copy of the file and its children so we don't mutate
      // the copies used in the backlog
      file = filter_files(_.extend({}, file));

      var source_path;
      if (file.type === 'file') {
        source_path = file.relative_path;
      } else {
        source_path = file.relative_path + '/';
      }

      SipArrange.copy_to_arrange('/originals/' + source_path, '/arrange/' + this.path + '/').then(on_copy_success, on_copy_failure);
    };

    var drop_from_arrange = function(unused, ui) {
      var path = ui.draggable.attr('file-path');

      SipArrange.move('/arrange/' + path, '/arrange/' + this.path + '/').then(on_copy_success, on_copy_failure);
    };

    load_data();
  }]);
})();
