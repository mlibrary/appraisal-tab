(function() {
  angular.module('treeView', []).directive('tree', function($parse) {
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

            new_element = $(template);
            element.replaceWith(new_element);
            $(new_element).tree({
              data: val,
            });
          });
        };
      },
    };
  });
})();
