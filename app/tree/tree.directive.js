'use strict';

import angular from 'angular';
import $ from 'jquery';

(function() {
  angular.module('treeDirectives', []).

  directive('treeDraggable', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var helper_fn = $parse(attrs.helper)($scope);

        $(element).draggable({
          appendTo: 'body',
          containment: false,
          cursor: 'move',
          helper: helper_fn,
          revert: 'invalid',
        });
      },
    };
  }]).

  directive('treeDroppable', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var drop_fn = $parse(attrs.onDrop)($scope);

        $(element).droppable({
          drop: drop_fn.bind($scope.node),
        });
      },
    };
  }]);
})();
