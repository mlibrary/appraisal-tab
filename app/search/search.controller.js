'use strict';

import angular from 'angular';

(function() {
  angular.module('searchController', ['alertService', 'transferService']).

  controller('SearchController', ['$scope', 'Alert', 'Transfer', function($scope, Alert, Transfer) {
    var on_request = function(data) {
      $scope.$apply(function() {
        Transfer.resolve(data);
      });
    };

    var on_error = function() {
      $scope.$apply(function() {
        Alert.alerts.push({
          type: 'danger',
          message: 'Unable to retrieve transfer data from Archivematica.',
        });
      });
    };

    renderBacklogSearchForm('/ingest/appraisal_list/', on_request, on_error);
  }]);
})();
