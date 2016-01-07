import angular from 'angular';

angular.module('searchController', ['alertService', 'transferService']).

controller('SearchController', ['$scope', 'Alert', 'Transfer', function($scope, Alert, Transfer) {
  var on_request = data => {
    $scope.$apply(() => {
      Transfer.resolve(data);
    });
  };

  var on_error = () => {
    $scope.$apply(() => {
      Alert.alerts.push({
        type: 'danger',
        message: 'Unable to retrieve transfer data from Archivematica.',
      });
    });
  };

  renderBacklogSearchForm('/ingest/appraisal_list/', on_request, on_error);
}]);
