'use strict';

(function() {
  angular.module('treeView', []).directive('tree', function($parse, SelectedFiles) {
    var iterate_and_apply_event_recursively = function(event, node, tree) {
      tree.tree(event, node);
      var modified = [node.id];
      node.iterate(function(child) {
        modified = modified.concat(iterate_and_apply_event_recursively(event, child, tree));
      });

      return modified;
    };

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      compile: function(element, attrs) {
        var treeData = $parse(attrs.treeData);
        var template = '<div id="' + attrs.id + '"></div>';

        return function(scope, element, attrs, controller) {
          // Watch the treeData so that the tree is regenerated should the treeData el change
          scope.$watch(treeData, function(val) {
            if (undefined === val) {
              return;
            }

            var new_element = $(template);
            element.replaceWith(new_element);
            new_element.tree({
              data: val,
            });
            new_element.bind('tree.click', function(el) {
              // Disable single selection
              el.preventDefault();

              var selected_node = el.node;
              if (new_element.tree('isNodeSelected', selected_node)) {
                var removed = iterate_and_apply_event_recursively('removeFromSelection', selected_node, new_element);

                scope.$apply(function() {
                  angular.forEach(removed, function(id) {
                    SelectedFiles.remove(id);
                  });
                });
              } else {
                var added = iterate_and_apply_event_recursively('addToSelection', selected_node, new_element);

                scope.$apply(function() {
                  angular.forEach(added, function(id) {
                    SelectedFiles.add(id);
                  });
                });
              }
            });
          });
        };
      },
    };
  });
})();
