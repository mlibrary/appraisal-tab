'use strict';

(function() {
  angular.module('analysisController', ['route-segment']).

  controller('AnalysisController', ['$scope', '$routeSegment', function($scope, $routeSegment) {
    $scope.$routeSegment = $routeSegment;
  }]);
})();
