'use strict';

(function() {
  angular.module('treeView', []).directive('tree', function($parse, SelectedFiles) {
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
                new_element.tree('removeFromSelection', selected_node);
                SelectedFiles.remove(selected_node.id);
              } else {
                new_element.tree('addToSelection', selected_node);
                SelectedFiles.add(selected_node.id);
              }
            });
          });
        };
      },
    };
  });
})();
