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
        var on_click = $parse(attrs.treeOnClick);
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
            new_element.iterate_and_apply_event_recursively = iterate_and_apply_event_recursively;

            var on_click_fn = on_click(scope);
            if (on_click_fn) {
              // on_click_fn is bound because it uses "this" to refer to
              // the parent element of the tree.
              new_element.bind('tree.click', on_click_fn.bind(new_element));
            }
          });
        };
      },
    };
  });
})();
