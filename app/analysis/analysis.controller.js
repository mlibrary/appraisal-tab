'use strict';

import angular from 'angular';

(function() {
  angular.module('analysisController', ['route-segment']).

  controller('AnalysisController', ['$scope', '$routeSegment', function($scope, $routeSegment) {
    $scope.$routeSegment = $routeSegment;
  }]);
})();
