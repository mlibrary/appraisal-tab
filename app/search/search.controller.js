'use strict';

(function() {
  angular.module('searchController', ['transferService']).

  controller('SearchController', ['$scope', 'Transfer', function($scope, Transfer) {
    var on_request = function(data) {
      $scope.$apply(function() {
        Transfer.resolve(data);
      });
    };

    renderBacklogSearchForm('/ingest/appraisal_list/', on_request);
  }]);
})();
