'use strict';

(function() {
  angular.module('treeView', []).directive('tree', function($parse) {
    var iterate_and_apply_event_recursively = function(event, node) {
      var self = this;

      self.tree(event, node);
      var modified = [node.id];
      node.iterate(function(child) {
        self.tree(event, child);
        modified.push(child.id);

        // Descend into child's children
        return true;
      });

      return modified;
    };

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      compile: function(element, attrs) {
        var treeData = $parse(attrs.treeData);
        var treeOptions = $parse(attrs.treeOptions);
        var template = '<div id="' + attrs.id + '"></div>';

        var callbacks = {
          'tree.click': $parse(attrs.treeOnClick),
          'tree.close': $parse(attrs.treeClose),
          'tree.contextmenu': $parse(attrs.treeContextMenu),
          'tree.dblclick': $parse(attrs.treeDblClick),
          'tree.init': $parse(attrs.treeInit),
          'tree.open': $parse(attrs.treeOpen),
          'tree.select': $parse(attrs.treeSelect),
        };

        return function(scope, element, attrs, controller) {
          // Watch the treeData so that the tree is regenerated should the treeData el change
          scope.$watch(treeData, function(val) {
            if (undefined === val) {
              return;
            }

            var options = treeOptions(scope);
            if (!options) {
              options = {};
            }
            options.data = val;

            var new_element = $(template);
            element.replaceWith(new_element);
            new_element.tree(options);
            new_element.iterate_and_apply_event_recursively = iterate_and_apply_event_recursively;

            angular.forEach(callbacks, function(getter, event) {
              var fn = getter(scope);
              if (fn) {
                // The callback is bound in order to allow it to use "this"
                // to refer to the parent element of the tree.
                new_element.bind(event, fn.bind(new_element));
              }
            });
          });
        };
      },
    };
  });
})();
