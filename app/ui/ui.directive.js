'use strict';

(function() {
  angular.module('uiDirectives', []).

  directive('uiMinimizeBar', [function() {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'ui/minimize-bar.html',
      controller: function($scope) {
        var panes = $scope.panes = [];

        $scope.toggle = function(pane) {
          pane.selected = !pane.selected;
          var width = 100 / panes.filter(function(e) { return e.selected; }).length + '%';
          // Update child element widths
          angular.forEach(panes, function(p) {
            p.width = width;
          });
        };
        this.addPane = function(pane) {
          panes.push(pane);
          $scope.toggle(pane);
        };
      },
    };
  }]).

  directive('uiMinimizePanel', [function() {
    return {
      require: '^uiMinimizeBar',
      restrict: 'E',
      transclude: true,
      scope: {
        title: '@',
      },
      templateUrl: 'ui/minimize-panel.html',
      link: function(scope, element, attrs, minimizeBar) {
        minimizeBar.addPane(scope);
      },
    };
  }]);

})();
